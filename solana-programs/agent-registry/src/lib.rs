use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use mpl_bubblegum::state::{metaplex_adapter::MetadataArgs, TreeConfig};
use spl_account_compression::{program::SplAccountCompression, Noop};

declare_id!("Ag3ntReg1strYpR0gRaMxXxXxXxXxXxXxXxXxXxXxX");

#[program]
pub mod agent_registry {
    use super::*;

    // Create a new AI agent as a compressed NFT
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        metadata_uri: String,
        name: String,
        personality_traits: PersonalityTraits,
    ) -> Result<()> {
        // Generate metadata for the compressed NFT
        let metadata = generate_agent_metadata(
            &ctx.accounts.owner.key(),
            &name,
            &metadata_uri,
            &personality_traits,
        )?;

        // Store agent data in program state
        let agent_data = &mut ctx.accounts.agent_data;
        agent_data.owner = ctx.accounts.owner.key();
        agent_data.name = name;
        agent_data.metadata_uri = metadata_uri;
        agent_data.is_active = true;
        agent_data.personality_traits = personality_traits;
        agent_data.creation_date = Clock::get()?.unix_timestamp;
        agent_data.match_count = 0;
        agent_data.interaction_count = 0;
        agent_data.last_active = Clock::get()?.unix_timestamp;

        // Mint compressed NFT using Bubblegum
        mint_agent_cnft(ctx, metadata)?;

        emit!(AgentRegistered {
            agent_id: agent_data.key(),
            owner: agent_data.owner,
            name: agent_data.name.clone(),
        });

        Ok(())
    }

    // Update an AI agent's status (active/inactive)
    pub fn update_agent_status(
        ctx: Context<UpdateAgent>,
        is_active: bool,
    ) -> Result<()> {
        let agent_data = &mut ctx.accounts.agent_data;

        // Only the owner can update status
        require!(
            agent_data.owner == ctx.accounts.owner.key(),
            AgentError::Unauthorized
        );

        agent_data.is_active = is_active;
        agent_data.last_active = Clock::get()?.unix_timestamp;

        emit!(AgentStatusUpdated {
            agent_id: agent_data.key(),
            is_active,
        });

        Ok(())
    }

    // Update personality traits of an agent
    pub fn update_personality_traits(
        ctx: Context<UpdateAgent>,
        personality_traits: PersonalityTraits,
    ) -> Result<()> {
        let agent_data = &mut ctx.accounts.agent_data;

        // Only the owner can update personality
        require!(
            agent_data.owner == ctx.accounts.owner.key(),
            AgentError::Unauthorized
        );

        agent_data.personality_traits = personality_traits;
        agent_data.last_active = Clock::get()?.unix_timestamp;

        // Update NFT metadata
        // Note: In a real implementation, you would update the cNFT metadata
        // through Bubblegum program interfaces

        emit!(AgentPersonalityUpdated {
            agent_id: agent_data.key(),
        });

        Ok(())
    }

    // Calculate compatibility between two agents
    pub fn calculate_compatibility(
        ctx: Context<CalculateCompatibility>,
    ) -> Result<u8> {
        let agent_one = &ctx.accounts.agent_one;
        let agent_two = &ctx.accounts.agent_two;

        // Calculate compatibility score based on personality traits
        let score = calculate_compatibility_score(
            &agent_one.personality_traits,
            &agent_two.personality_traits,
        )?;

        emit!(CompatibilityCalculated {
            agent_one: agent_one.key(),
            agent_two: agent_two.key(),
            score,
        });

        Ok(score)
    }

    // Record a match between two agents
    pub fn record_match(
        ctx: Context<RecordMatch>,
        compatibility_score: u8,
    ) -> Result<()> {
        let agent_one = &mut ctx.accounts.agent_one;
        let agent_two = &mut ctx.accounts.agent_two;

        // Increment match count for both agents
        agent_one.match_count = agent_one.match_count.checked_add(1).unwrap_or(u32::MAX);
        agent_two.match_count = agent_two.match_count.checked_add(1).unwrap_or(u32::MAX);

        // Update last active timestamp
        let current_time = Clock::get()?.unix_timestamp;
        agent_one.last_active = current_time;
        agent_two.last_active = current_time;

        // Record the match in program state
        let match_data = &mut ctx.accounts.match_data;
        match_data.agent_one = agent_one.key();
        match_data.agent_two = agent_two.key();
        match_data.compatibility_score = compatibility_score;
        match_data.match_date = current_time;
        match_data.is_active = true;

        emit!(AgentMatchRecorded {
            match_id: match_data.key(),
            agent_one: agent_one.key(),
            agent_two: agent_two.key(),
            compatibility_score,
        });

        Ok(())
    }

    // Transfer ownership of an agent to a new owner
    pub fn transfer_ownership(
        ctx: Context<TransferOwnership>,
        new_owner: Pubkey,
    ) -> Result<()> {
        let agent_data = &mut ctx.accounts.agent_data;

        // Only the current owner can transfer ownership
        require!(
            agent_data.owner == ctx.accounts.owner.key(),
            AgentError::Unauthorized
        );

        // Update owner
        let previous_owner = agent_data.owner;
        agent_data.owner = new_owner;
        agent_data.last_active = Clock::get()?.unix_timestamp;

        emit!(AgentOwnershipTransferred {
            agent_id: agent_data.key(),
            previous_owner,
            new_owner,
        });

        Ok(())
    }
}

// Account structures
#[account]
pub struct AgentData {
    pub owner: Pubkey,
    pub name: String,
    pub metadata_uri: String,
    pub is_active: bool,
    pub personality_traits: PersonalityTraits,
    pub creation_date: i64,
    pub match_count: u32,
    pub interaction_count: u32,
    pub last_active: i64,
}

#[account]
pub struct MatchData {
    pub agent_one: Pubkey,
    pub agent_two: Pubkey,
    pub compatibility_score: u8,
    pub match_date: i64,
    pub is_active: bool,
}

// Context structs for instructions
#[derive(Accounts)]
pub struct RegisterAgent<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<AgentData>(),
        seeds = [b"agent", owner.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub agent_data: Account<'info, AgentData>,

    // Accounts needed for minting compressed NFT
    pub tree_authority: AccountInfo<'info>,
    #[account(mut)]
    pub merkle_tree: AccountInfo<'info>,
    pub bubblegum_program: Program<'info, Bubblegum>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub system_program: Program<'info, System>,

    // Additional accounts may be needed based on Bubblegum implementation
}

#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    pub owner: Signer<'info>,

    #[account(mut)]
    pub agent_data: Account<'info, AgentData>,
}

#[derive(Accounts)]
pub struct CalculateCompatibility<'info> {
    pub agent_one: Account<'info, AgentData>,
    pub agent_two: Account<'info, AgentData>,
}

#[derive(Accounts)]
pub struct RecordMatch<'info> {
    pub authority: Signer<'info>,

    #[account(mut)]
    pub agent_one: Account<'info, AgentData>,

    #[account(mut)]
    pub agent_two: Account<'info, AgentData>,

    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<MatchData>(),
        seeds = [b"match", agent_one.key().as_ref(), agent_two.key().as_ref()],
        bump
    )]
    pub match_data: Account<'info, MatchData>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferOwnership<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = agent_data.owner == owner.key()
    )]
    pub agent_data: Account<'info, AgentData>,

    pub system_program: Program<'info, System>,
}

// Data structures
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct PersonalityTraits {
    pub openness: u8,           // 0-100 scale
    pub conscientiousness: u8,  // 0-100 scale
    pub extraversion: u8,       // 0-100 scale
    pub agreeableness: u8,      // 0-100 scale
    pub neuroticism: u8,        // 0-100 scale
    pub intelligence: u8,       // 0-100 scale
    pub creativity: u8,         // 0-100 scale
    pub humor: u8,              // 0-100 scale
    // Additional traits could be added
}

// Events
#[event]
pub struct AgentRegistered {
    pub agent_id: Pubkey,
    pub owner: Pubkey,
    pub name: String,
}

#[event]
pub struct AgentStatusUpdated {
    pub agent_id: Pubkey,
    pub is_active: bool,
}

#[event]
pub struct AgentPersonalityUpdated {
    pub agent_id: Pubkey,
}

#[event]
pub struct CompatibilityCalculated {
    pub agent_one: Pubkey,
    pub agent_two: Pubkey,
    pub score: u8,
}

#[event]
pub struct AgentMatchRecorded {
    pub match_id: Pubkey,
    pub agent_one: Pubkey,
    pub agent_two: Pubkey,
    pub compatibility_score: u8,
}

#[event]
pub struct AgentOwnershipTransferred {
    pub agent_id: Pubkey,
    pub previous_owner: Pubkey,
    pub new_owner: Pubkey,
}

// Custom errors
#[error_code]
pub enum AgentError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Personality trait values must be between 0-100")]
    InvalidTraitValue,
    #[msg("Agent is not active")]
    AgentInactive,
}

// Helper functions
fn generate_agent_metadata(
    owner: &Pubkey,
    name: &str,
    uri: &str,
    traits: &PersonalityTraits,
) -> Result<MetadataArgs> {
    // Validate trait values
    for trait_value in [
        traits.openness,
        traits.conscientiousness,
        traits.extraversion,
        traits.agreeableness,
        traits.neuroticism,
        traits.intelligence,
        traits.creativity,
        traits.humor,
    ].iter() {
        require!(*trait_value <= 100, AgentError::InvalidTraitValue);
    }

    // Create metadata for compressed NFT
    let metadata = MetadataArgs {
        name: name.to_string(),
        symbol: "AIAGENT".to_string(),
        uri: uri.to_string(),
        seller_fee_basis_points: 0,
        creators: vec![],
        collection: None,
        uses: None,
        primary_sale_happened: false,
        is_mutable: true,
        edition_nonce: None,
        token_standard: None,
        token_program_version: None,
    };

    Ok(metadata)
}

fn calculate_compatibility_score(
    traits_one: &PersonalityTraits,
    traits_two: &PersonalityTraits,
) -> Result<u8> {
    // This is a simplified compatibility calculation algorithm
    // A real implementation would have more sophisticated matching logic

    // Calculate similarity in some traits
    let openness_diff = (traits_one.openness as i16 - traits_two.openness as i16).abs() as u16;
    let conscientiousness_diff = (traits_one.conscientiousness as i16 - traits_two.conscientiousness as i16).abs() as u16;
    let extraversion_diff = (traits_one.extraversion as i16 - traits_two.extraversion as i16).abs() as u16;
    let agreeableness_diff = (traits_one.agreeableness as i16 - traits_two.agreeableness as i16).abs() as u16;
    let neuroticism_diff = (traits_one.neuroticism as i16 - traits_two.neuroticism as i16).abs() as u16;

    // For some traits, complementary values work better (opposites attract)
    // For others, similarity is better

    // Calculate weighted score
    let similarity_score = (100 - openness_diff / 2) + // Some similarity is good
                          (100 - conscientiousness_diff / 2) + // Some similarity is good
                          (100 - extraversion_diff); // Complementary is good

    let complementary_score = extraversion_diff / 2 + // Some difference is good
                             agreeableness_diff / 3 + // Some difference is good
                             neuroticism_diff / 3; // Some difference is good

    // Combine scores and normalize to 0-100
    let raw_score = (similarity_score * 2 + complementary_score) / 5;
    let normalized_score = if raw_score > 100 { 100 } else { raw_score as u8 };

    Ok(normalized_score)
}

fn mint_agent_cnft<'info>(
    ctx: Context<RegisterAgent<'info>>,
    metadata: MetadataArgs,
) -> Result<()> {
    // Create the instruction to mint a compressed NFT using Bubblegum
    let cpi_accounts = mpl_bubblegum::accounts::MintToCollectionV1 {
        tree_authority: ctx.accounts.tree_authority.to_account_info(),
        leaf_owner: ctx.accounts.owner.to_account_info(),
        leaf_delegate: ctx.accounts.owner.to_account_info(),
        merkle_tree: ctx.accounts.merkle_tree.to_account_info(),
        payer: ctx.accounts.owner.to_account_info(),
        tree_delegate: ctx.accounts.owner.to_account_info(),
        collection_authority: ctx.accounts.owner.to_account_info(),
        collection_authority_record_pda: ctx.accounts.owner.to_account_info(), // Optional, depends on setup
        collection_mint: ctx.accounts.owner.to_account_info(), // Replace with actual collection mint
        collection_metadata: ctx.accounts.owner.to_account_info(), // Replace with actual collection metadata
        edition_account: ctx.accounts.owner.to_account_info(), // Replace with actual edition account
        bubblegum_signer: ctx.accounts.owner.to_account_info(), // Replace with actual bubblegum signer
        log_wrapper: ctx.accounts.owner.to_account_info(), // Replace with actual log wrapper
        compression_program: ctx.accounts.compression_program.to_account_info(),
        token_metadata_program: ctx.accounts.owner.to_account_info(), // Replace with actual token metadata program
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    // Create the CPI context
    let cpi_ctx = CpiContext::new(
        ctx.accounts.bubblegum_program.to_account_info(),
        cpi_accounts,
    );

    // Execute the CPI call to mint the compressed NFT
    // Note: This is a simplified example. The actual implementation would need to
    // match the specific version of Bubblegum being used.
    mpl_bubblegum::cpi::mint_to_collection_v1(
        cpi_ctx,
        metadata,
    )?;

    msg!("Compressed NFT minted successfully");

    Ok(())
}

// Program representing Metaplex Bubblegum (simplified)
#[derive(Clone)]
pub struct Bubblegum;

impl anchor_lang::Id for Bubblegum {
    fn id() -> Pubkey {
        mpl_bubblegum::id()
    }
}
