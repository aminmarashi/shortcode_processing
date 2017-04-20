import { get_bet_parameters } from '../src/get_bet_parameters.js';
import { expect } from 'chai';

describe('get_bet_parameters', () => {
    const active_symbols = [{
        "allow_forward_starting": 1,
        "display_name": "Bull Market Index",
        "exchange_is_open": 1,
        "is_trading_suspended": 0,
        "market": "volidx",
        "market_display_name": "Volatility Indices",
        "pip": "0.0001",
        "submarket": "random_daily",
        "submarket_display_name": "Daily Reset Indices",
        "symbol": "RDBULL",
        "symbol_type": "stockindex"
    },
    {
        "allow_forward_starting": 1,
        "display_name": "Volatility 10 Index",
        "exchange_is_open": 1,
        "is_trading_suspended": 0,
        "market": "volidx",
        "market_display_name": "Volatility Indices",
        "pip": "0.001",
        "submarket": "random_index",
        "submarket_display_name": "Continuous Indices",
        "symbol": "R_10",
        "symbol_type": "stockindex"
    }];

    it('Throws error if active_symbols is undefined', () => {
        expect(() => get_bet_parameters('invalid_invalid', 'USD', undefined))
            .to.throw('Active Symbols list not present');
    });

    it('Sends "invalid" as bet_type for unsupported shortcodes', () => {
        expect(get_bet_parameters('invalid_invalid', 'USD', active_symbols).bet_type)
            .to.equal('Invalid');
    });

    describe('Barriers', () => {
        it('Contracts with no barriers (Asians)', () => {
            expect(get_bet_parameters('ASIANU_R_10_3.88_1492410252_5T', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 0,
                    shortcode: 'ASIANU_R_10_3.88_1492410252_5T',
                    bet_type: 'ASIANU',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount: 3.88,
                    date_start: 1492410252,
                    amount_type: 'payout',
                    tick_expiry: 1,
                    tick_count: 5,
                    currency: 'USD'
                });
        });

        it('Contracts with no barriers (Normal)', () => {
            expect(get_bet_parameters('CALL_R_10_10_1492405008_5T_S0P_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 0,
                    shortcode: 'CALL_R_10_10_1492405008_5T_S0P_0',
                    bet_type: 'CALL',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 10,
                    date_start: 1492405008,
                    tick_expiry: 1,
                    tick_count: 5,
                    currency: 'USD'
                });
        });

        it('Contracts with 1 barriers', () => {
            expect(get_bet_parameters('CALL_R_10_70.73_1492407012_5T_S1366P_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    shortcode: 'CALL_R_10_70.73_1492407012_5T_S1366P_0',
                    bet_type: 'CALL',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 70.73,
                    date_start: 1492407012,
                    tick_expiry: 1,
                    tick_count: 5,
                    barrier: '1.366',
                    currency: 'USD'
                });
        });

        it('Contracts with 2 barriers', () => {
            expect(get_bet_parameters('EXPIRYRANGE_R_10_3.25_1492407769_1492407889_S1796P_S-1795P', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 2,
                    shortcode: 'EXPIRYRANGE_R_10_3.25_1492407769_1492407889_S1796P_S-1795P',
                    bet_type: 'EXPIRYRANGE',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 3.25,
                    date_start: 1492407769,
                    date_expiry: 1492407889,
                    high_barrier: '1.796',
                    low_barrier: '-1.795',
                    currency: 'USD'
                });
        });

        it('Contracts with 1 absolute barrier', () => {
            expect(get_bet_parameters('CALL_R_10_10_1492585652_1492732799_10862000000_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    barrier_absolute: 1,
                    barrier: '10862.000',
                    shortcode: 'CALL_R_10_10_1492585652_1492732799_10862000000_0',
                    bet_type: 'CALL',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 10,
                    date_start: 1492585652,
                    date_expiry: 1492732799,
                    currency: 'USD'
                });
        });

        it('Contracts with 2 absolute barrier', () => {
            expect(get_bet_parameters('EXPIRYMISS_R_10_10_1492582188_1492732799F_10815110000_10811110000', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 2,
                    barrier_absolute: 1,
                    shortcode: 'EXPIRYMISS_R_10_10_1492582188_1492732799F_10815110000_10811110000',
                    bet_type: 'EXPIRYMISS',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 10,
                    date_start: 1492582188,
                    date_expiry: 1492732799,
                    fixed_expiry: 1,
                    high_barrier: '10815.110',
                    low_barrier: '10811.110',
                    currency: 'USD'
                });
        });
    })

    describe('Digits', () => {
        it('DIGITDIFF type contract', () => {
            expect(get_bet_parameters('DIGITDIFF_R_10_2.2_1492408062_5T_4_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    barrier: '4',
                    barrier_absolute: 1,
                    shortcode: 'DIGITDIFF_R_10_2.2_1492408062_5T_4_0',
                    bet_type: 'DIGITDIFF',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 2.2,
                    date_start: 1492408062,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD'
                });
        });

        it('DIGITMATCH type contract', () => {
            expect(get_bet_parameters('DIGITMATCH_R_10_18.18_1492407891_5T_4_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    barrier: '4',
                    barrier_absolute: 1,
                    shortcode: 'DIGITMATCH_R_10_18.18_1492407891_5T_4_0',
                    bet_type: 'DIGITMATCH',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 18.18,
                    date_start: 1492407891,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD'
                });
        });

        it('DIGITOVER type contract', () => {
            expect(get_bet_parameters('DIGITOVER_R_10_4.88_1492408153_5T_5_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    barrier: '5',
                    barrier_absolute: 1,
                    shortcode: 'DIGITOVER_R_10_4.88_1492408153_5T_5_0',
                    bet_type: 'DIGITOVER',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 4.88,
                    date_start: 1492408153,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD'
                });
        });

        it('DIGITUNDER type contract', () => {
            expect(get_bet_parameters('DIGITUNDER_R_10_2.82_1492408225_5T_7_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 1,
                    barrier: '7',
                    barrier_absolute: 1,
                    shortcode: 'DIGITUNDER_R_10_2.82_1492408225_5T_7_0',
                    bet_type: 'DIGITUNDER',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 2.82,
                    date_start: 1492408225,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD'
                });
        });

        it('DIGITODD type contract', () => {
            expect(get_bet_parameters('DIGITODD_R_10_3.92_1492408262_5T_0_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 0,
                    shortcode: 'DIGITODD_R_10_3.92_1492408262_5T_0_0',
                    bet_type: 'DIGITODD',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 3.92,
                    date_start: 1492408262,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD',
                });
        });

        it('DIGITEVEN type contract', () => {
            expect(get_bet_parameters('DIGITEVEN_R_10_3.92_1492410208_5T_0_0', 'USD', active_symbols))
                .to.deep.equal({
                    barrier_count: 0,
                    shortcode: 'DIGITEVEN_R_10_3.92_1492410208_5T_0_0',
                    bet_type: 'DIGITEVEN',
                    underlying: "Volatility 10 Index",
                    underlying_symbol: 'R_10',
                    amount_type: 'payout',
                    amount: 3.92,
                    date_start: 1492410208,
                    tick_count: 5,
                    tick_expiry: 1,
                    currency: 'USD',
                });
        });
    })
});
