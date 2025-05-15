use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, Transfer},
    associated_token::AssociatedToken,
};

declare_id!("1nf1uenceT0kenPr0graMxXxXxXxXxXxXxXxXxXxX");

#[program]
pub mod influence {
    use super::*;

    // Initialize the influence token mint
    pub fn initialize_mint(
        ctx: Context<InitializeMint>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let mint_config = &mut ctx.accounts.mint_config;
        mint_config.authority = ctx.accounts.authority.key();
        mint_config.mint = ctx.accounts.mint.key();
        mint_config.name = name;
        mint_config.symbol = symbol;
        mint_config.uri = uri;
        mint_config.is_active = true;
        
        emit!(MintInitialized {
            mint: mint_config.mint,
            authority: mint_config.authority,
            name: mint_config.name.clone(),
            symbol: mint_config.symbol.clone(),
        });
        
        Ok(())
    }
    
    // Mint influence tokens to a user
    pub fn mint_tokens(
        ctx: Context<MintTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        // Ensure mint is active
        require!(
            ctx.accounts.mint_config.is_active,
            InfluenceError::MintInactive
        );
        
        // Ensure amount is valid
        require!(amount > 0, InfluenceError::InvalidAmount);
        
        // Mint tokens to the recipient
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::mint_to(cpi_ctx, amount)?;
        
        // Record the mint transaction
        let mint_record = &mut ctx.accounts.mint_record;
        mint_record.mint = ctx.accounts.mint.key();
        mint_record.recipient = ctx.accounts.recipient.key();
        mint_record.amount = amount;
        mint_record.timestamp = Clock::get()?.unix_timestamp;
        mint_record.reason = reason;
        
        emit!(TokensMinted {
            mint: mint_record.mint,
            recipient: mint_record.recipient,
            amount,
            reason: mint_record.reason.clone(),
        });
        
        Ok(())
    }
    
    // Burn influence tokens
    pub fn burn_tokens(
        ctx: Context<BurnTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        // Ensure amount is valid
        require!(amount > 0, InfluenceError::InvalidAmount);
        
        // Burn tokens from the owner's account
        let cpi_accounts = token::Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.owner_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::burn(cpi_ctx, amount)?;
        
        // Record the burn transaction
        let burn_record = &mut ctx.accounts.burn_record;
        burn_record.mint = ctx.accounts.mint.key();
        burn_record.owner = ctx.accounts.owner.key();
        burn_record.amount = amount;
        burn_record.timestamp = Clock::get()?.unix_timestamp;
        burn_record.reason = reason;
        
        emit!(TokensBurned {
            mint: burn_record.mint,
            owner: burn_record.owner,
            amount,
            reason: burn_record.reason.clone(),
        });
        
        Ok(())
    }
    
    // Transfer influence tokens between users
    pub fn transfer_tokens(
        ctx: Context<TransferTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        // Ensure amount is valid
        require!(amount > 0, InfluenceError::InvalidAmount);
        
        // Transfer tokens from sender to recipient
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;
        
        // Record the transfer transaction
        let transfer_record = &mut ctx.accounts.transfer_record;
        transfer_record.mint = ctx.accounts.mint.key();
        transfer_record.sender = ctx.accounts.sender.key();
        transfer_record.recipient = ctx.accounts.recipient.key();
        transfer_record.amount = amount;
        transfer_record.timestamp = Clock::get()?.unix_timestamp;
        transfer_record.reason = reason;
        
        emit!(TokensTransferred {
            mint: transfer_record.mint,
            sender: transfer_record.sender,
            recipient: transfer_record.recipient,
            amount,
            reason: transfer_record.reason.clone(),
        });
        
        Ok(())
    }
    
    // Update mint status (active/inactive)
    pub fn update_mint_status(
        ctx: Context<UpdateMint>,
        is_active: bool,
    ) -> Result<()> {
        let mint_config = &mut ctx.accounts.mint_config;
        
        // Only the authority can update status
        require!(
            mint_config.authority == ctx.accounts.authority.key(),
            InfluenceError::Unauthorized
        );
        
        mint_config.is_active = is_active;
        
        emit!(MintStatusUpdated {
            mint: mint_config.mint,
            is_active,
        });
        
        Ok(())
    }
}

// Account structures
#[account]
pub struct MintConfig {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub is_active: bool,
}

#[account]
pub struct MintRecord {
    pub mint: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub reason: String,
}

#[account]
pub struct BurnRecord {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub reason: String,
}

#[account]
pub struct TransferRecord {
    pub mint: Pubkey,
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub reason: String,
}

// Context structs for instructions
#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = authority.key(),
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<MintConfig>() + 100, // Extra space for strings
        seeds = [b"mint_config", mint.key().as_ref()],
        bump
    )]
    pub mint_config: Account<'info, MintConfig>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        constraint = mint_config.mint == mint.key(),
        constraint = mint_config.authority == authority.key(),
    )]
    pub mint_config: Account<'info, MintConfig>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    pub recipient: AccountInfo<'info>,
    
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<MintRecord>() + 100, // Extra space for reason
        seeds = [
            b"mint_record", 
            mint.key().as_ref(), 
            recipient.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub mint_record: Account<'info, MintRecord>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        mut,
        constraint = owner_token_account.mint == mint.key(),
        constraint = owner_token_account.owner == owner.key(),
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<BurnRecord>() + 100, // Extra space for reason
        seeds = [
            b"burn_record", 
            mint.key().as_ref(), 
            owner.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub burn_record: Account<'info, BurnRecord>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    
    pub mint: Account<'info, Mint>,
    
    pub recipient: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = sender_token_account.mint == mint.key(),
        constraint = sender_token_account.owner == sender.key(),
    )]
    pub sender_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = sender,
        space = 8 + std::mem::size_of::<TransferRecord>() + 100, // Extra space for reason
        seeds = [
            b"transfer_record", 
            mint.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub transfer_record: Account<'info, TransferRecord>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateMint<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        constraint = mint_config.authority == authority.key(),
    )]
    pub mint_config: Account<'info, MintConfig>,
}

// Events
#[event]
pub struct MintInitialized {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
}

#[event]
pub struct TokensMinted {
    pub mint: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub reason: String,
}

#[event]
pub struct TokensBurned {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub reason: String,
}

#[event]
pub struct TokensTransferred {
    pub mint: Pubkey,
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub reason: String,
}

#[event]
pub struct MintStatusUpdated {
    pub mint: Pubkey,
    pub is_active: bool,
}

// Custom errors
#[error_code]
pub enum InfluenceError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid token amount")]
    InvalidAmount,
    #[msg("Mint is not active")]
    MintInactive,
}
