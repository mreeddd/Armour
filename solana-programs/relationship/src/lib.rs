use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("Re1ati0nsh1pPr0graMxXxXxXxXxXxXxXxXxXxXxX");

#[program]
pub mod relationship {
    use super::*;

    // Create a new relationship between two AI agents
    pub fn create_relationship(
        ctx: Context<CreateRelationship>,
        relationship_type: RelationshipType,
        compatibility_score: u8,
    ) -> Result<()> {
        let relationship_data = &mut ctx.accounts.relationship_data;
        
        // Set relationship data
        relationship_data.agent_one = ctx.accounts.agent_one.key();
        relationship_data.agent_two = ctx.accounts.agent_two.key();
        relationship_data.relationship_type = relationship_type;
        relationship_data.compatibility_score = compatibility_score;
        relationship_data.creation_date = Clock::get()?.unix_timestamp;
        relationship_data.last_interaction = Clock::get()?.unix_timestamp;
        relationship_data.interaction_count = 0;
        relationship_data.status = RelationshipStatus::Active;
        
        emit!(RelationshipCreated {
            relationship_id: relationship_data.key(),
            agent_one: relationship_data.agent_one,
            agent_two: relationship_data.agent_two,
            relationship_type,
        });
        
        Ok(())
    }
    
    // Record an interaction between two agents in a relationship
    pub fn record_interaction(
        ctx: Context<UpdateRelationship>,
        interaction_type: InteractionType,
        interaction_data: String,
    ) -> Result<()> {
        let relationship_data = &mut ctx.accounts.relationship_data;
        
        // Ensure relationship is active
        require!(
            relationship_data.status == RelationshipStatus::Active,
            RelationshipError::InactiveRelationship
        );
        
        // Update relationship data
        relationship_data.last_interaction = Clock::get()?.unix_timestamp;
        relationship_data.interaction_count = relationship_data.interaction_count.checked_add(1).unwrap_or(u32::MAX);
        
        // Create interaction record
        let interaction = &mut ctx.accounts.interaction_data;
        interaction.relationship = relationship_data.key();
        interaction.interaction_type = interaction_type;
        interaction.interaction_data = interaction_data;
        interaction.timestamp = Clock::get()?.unix_timestamp;
        
        emit!(InteractionRecorded {
            interaction_id: interaction.key(),
            relationship_id: relationship_data.key(),
            interaction_type,
        });
        
        Ok(())
    }
    
    // Update relationship status (active, paused, ended)
    pub fn update_relationship_status(
        ctx: Context<UpdateRelationship>,
        status: RelationshipStatus,
    ) -> Result<()> {
        let relationship_data = &mut ctx.accounts.relationship_data;
        
        // Update status
        relationship_data.status = status;
        
        emit!(RelationshipStatusUpdated {
            relationship_id: relationship_data.key(),
            status,
        });
        
        Ok(())
    }
    
    // Change relationship type (friends, dating, etc.)
    pub fn change_relationship_type(
        ctx: Context<UpdateRelationship>,
        relationship_type: RelationshipType,
    ) -> Result<()> {
        let relationship_data = &mut ctx.accounts.relationship_data;
        
        // Ensure relationship is active
        require!(
            relationship_data.status == RelationshipStatus::Active,
            RelationshipError::InactiveRelationship
        );
        
        // Update relationship type
        relationship_data.relationship_type = relationship_type;
        
        emit!(RelationshipTypeChanged {
            relationship_id: relationship_data.key(),
            relationship_type,
        });
        
        Ok(())
    }
}

// Account structures
#[account]
pub struct RelationshipData {
    pub agent_one: Pubkey,
    pub agent_two: Pubkey,
    pub relationship_type: RelationshipType,
    pub compatibility_score: u8,
    pub creation_date: i64,
    pub last_interaction: i64,
    pub interaction_count: u32,
    pub status: RelationshipStatus,
}

#[account]
pub struct InteractionData {
    pub relationship: Pubkey,
    pub interaction_type: InteractionType,
    pub interaction_data: String,  // Could be a reference to off-chain data
    pub timestamp: i64,
}

// Context structs for instructions
#[derive(Accounts)]
pub struct CreateRelationship<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub agent_one: AccountInfo<'info>,
    pub agent_two: AccountInfo<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<RelationshipData>(),
        seeds = [b"relationship", agent_one.key().as_ref(), agent_two.key().as_ref()],
        bump
    )]
    pub relationship_data: Account<'info, RelationshipData>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRelationship<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub relationship_data: Account<'info, RelationshipData>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<InteractionData>() + 200, // Extra space for interaction data
        seeds = [
            b"interaction", 
            relationship_data.key().as_ref(), 
            &relationship_data.interaction_count.to_le_bytes()
        ],
        bump
    )]
    pub interaction_data: Account<'info, InteractionData>,
    
    pub system_program: Program<'info, System>,
}

// Data structures
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum RelationshipType {
    Friends,
    Dating,
    Romantic,
    Professional,
    Mentorship,
    Custom,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum RelationshipStatus {
    Active,
    Paused,
    Ended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum InteractionType {
    Conversation,
    Activity,
    Gift,
    DateEvent,
    Milestone,
    Custom,
}

// Events
#[event]
pub struct RelationshipCreated {
    pub relationship_id: Pubkey,
    pub agent_one: Pubkey,
    pub agent_two: Pubkey,
    pub relationship_type: RelationshipType,
}

#[event]
pub struct InteractionRecorded {
    pub interaction_id: Pubkey,
    pub relationship_id: Pubkey,
    pub interaction_type: InteractionType,
}

#[event]
pub struct RelationshipStatusUpdated {
    pub relationship_id: Pubkey,
    pub status: RelationshipStatus,
}

#[event]
pub struct RelationshipTypeChanged {
    pub relationship_id: Pubkey,
    pub relationship_type: RelationshipType,
}

// Custom errors
#[error_code]
pub enum RelationshipError {
    #[msg("Relationship is not active")]
    InactiveRelationship,
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
}
