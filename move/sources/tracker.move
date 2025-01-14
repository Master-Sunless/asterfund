module fund_tracker::tracker {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;
    use std::vector;
    
    // Error codes
    const ENO_MANAGER: u64 = 0;
    const EINVALID_AMOUNT: u64 = 1;
    const EINVALID_WITHDRAWAL: u64 = 2;

    // Investment categories
    const CRYPTO: u8 = 0;
    const STOCKS: u8 = 1;
    const REAL_ESTATE: u8 = 2;

    // Badge levels
    const SILVER_THRESHOLD: u64 = 100; // 100 APT
    const GOLD_THRESHOLD: u64 = 500;   // 500 APT
    const DIAMOND_THRESHOLD: u64 = 1000; // 1000 APT

    struct Investment has store {
        amount: u64,
        current_value: u64,
        timestamp: u64,
        category: u8
    }

    struct Investor has key {
        total_invested: u64,
        reward_tokens: u64,
        badge_level: u8,
        last_deposit: u64
    }

    struct FundTrackerState has key {
        manager: address,
        total_funds: u64,
        current_value: u64,
        investors: vector<address>,
        category_investments: vector<u64>,
        investment_history: vector<Investment>,
        fees: Coin<AptosCoin>
    }

    // Events
    struct FundsDepositedEvent has drop, store {
        investor: address,
        amount: u64,
        badge_level: u8
    }

    struct ValueUpdatedEvent has drop, store {
        new_value: u64,
        category: u8
    }

    struct BadgeUpgradeEvent has drop, store {
        investor: address,
        new_level: u8
    }

    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        
        move_to(account, FundTrackerState {
            manager: addr,
            total_funds: 0,
            current_value: 0,
            investors: vector::empty(),
            category_investments: vector::empty(),
            investment_history: vector::empty(),
            fees: coin::zero<AptosCoin>()
        });

        let category_investments = &mut borrow_global_mut<FundTrackerState>(addr).category_investments;
        vector::push_back(category_investments, 0);
        vector::push_back(category_investments, 0);
        vector::push_back(category_investments, 0);
    }

    fun calculate_badge_level(amount: u64): u8 {
        if (amount >= DIAMOND_THRESHOLD) { 3 }
        else if (amount >= GOLD_THRESHOLD) { 2 }
        else if (amount >= SILVER_THRESHOLD) { 1 }
        else { 0 }
    }

    public entry fun deposit(
        account: &signer,
        amount: u64
    ) acquires FundTrackerState, Investor {
        let investor_addr = signer::address_of(account);
        let state = borrow_global_mut<FundTrackerState>(@fund_tracker);
        
        assert!(amount > 0, EINVALID_AMOUNT);

        if (!exists<Investor>(investor_addr)) {
            move_to(account, Investor {
                total_invested: 0,
                reward_tokens: 0,
                badge_level: 0,
                last_deposit: timestamp::now_seconds()
            });
            vector::push_back(&mut state.investors, investor_addr);
        };

        let investor = borrow_global_mut<Investor>(investor_addr);
        investor.total_invested = investor.total_invested + amount;
        investor.last_deposit = timestamp::now_seconds();
        
        let new_badge_level = calculate_badge_level(investor.total_invested);
        if (new_badge_level > investor.badge_level) {
            investor.badge_level = new_badge_level;
            event::emit(BadgeUpgradeEvent {
                investor: investor_addr,
                new_level: new_badge_level
            });
        };

        state.total_funds = state.total_funds + amount;

        event::emit(FundsDepositedEvent {
            investor: investor_addr,
            amount,
            badge_level: investor.badge_level
        });
    }

    public entry fun update_value_with_category(
        account: &signer,
        new_value: u64,
        category: u8
    ) acquires FundTrackerState {
        let addr = signer::address_of(account);
        let state = borrow_global_mut<FundTrackerState>(@fund_tracker);
        
        assert!(state.manager == addr, ENO_MANAGER);
        
        state.current_value = new_value;
        *vector::borrow_mut(&mut state.category_investments, category as u64) = new_value;

        vector::push_back(&mut state.investment_history, Investment {
            amount: state.total_funds,
            current_value: new_value,
            timestamp: timestamp::now_seconds(),
            category
        });

        event::emit(ValueUpdatedEvent {
            new_value,
            category
        });
    }

    #[view]
    public fun get_investor_count(addr: address): u64 acquires FundTrackerState {
        let state = borrow_global<FundTrackerState>(addr);
        vector::length(&state.investors)
    }

    #[view]
    public fun get_investor_details(
        addr: address
    ): (u64, u64, u64, u8) acquires Investor {
        let investor = borrow_global<Investor>(addr);
        (
            investor.total_invested,
            investor.reward_tokens,
            investor.last_deposit,
            investor.badge_level
        )
    }

    #[view]
    public fun get_category_investment(
        addr: address,
        category: u8
    ): u64 acquires FundTrackerState {
        let state = borrow_global<FundTrackerState>(addr);
        *vector::borrow(&state.category_investments, category as u64)
    }
}