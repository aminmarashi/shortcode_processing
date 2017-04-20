import { LongCode } from '../src/longcode_generator.js';
import { get_bet_parameters } from '../src/get_bet_parameters.js';
import { expect } from 'chai';

describe('Longcode Generator', () => {
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
    const longcode = new LongCode('en')

    describe('ASIAN', () => {
        it('ASIANU contract type.', () => {
            const param = get_bet_parameters('ASIANU_R_10_3.88_1492410252_5T', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 3.88 USD if the last tick of Volatility 10 Index is strictly higher than the average of the 5 ticks.');
        });

        it('ASIAND contract type.', () => {
            const param = get_bet_parameters('ASIAND_R_10_3.88_1492410530_5T', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 3.88 USD if the last tick of Volatility 10 Index is strictly lower than the average of the 5 ticks.');
        });
    });

    describe('CALL', () => {
        it('Contract having no barrier and tick as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492495694_5T_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly higher than entry spot.');
        });

        it('Contract having +ve barrier and tick as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492495842_5T_S364P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly higher than entry spot plus 0.364.');
        });

        it('Contract having -ve barrier and tick as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492496024_5T_S-364P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly higher than entry spot minus 0.364.');
        });

        it('Contracts having +ve barrier and hours as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492585037_1492592365_S628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot plus 0.628 at 2 hours 2 minutes 8 seconds after contract start time.')
        });

        it('Contracts having -ve barrier and hours as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492585037_1492592365_S-628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot minus 0.628 at 2 hours 2 minutes 8 seconds after contract start time.')
        });

        it('Contracts having absolute barrier and days as duration.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492585652_1492732799_10862000000_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than 10862.000 at close on 2017-04-20.')
        });

        it('Forward starting contract.', () => {
            let param = get_bet_parameters('CALL_R_10_10_1492498500F_1492502760_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at 1 hour 11 minutes after 2017-04-18 06:55:00 GMT.');
            param = get_bet_parameters('CALL_R_10_10_1492501500F_1492552200F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at 14 hours 5 minutes after 2017-04-18 07:45:00 GMT.');
        });

        it('Intraday contract having fixed expiry.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492501145_1492559400F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at 2017-04-18 23:50:00 GMT.');
        });

        it('Daily contract having fixed expiry.', () => {
            const param = get_bet_parameters('CALL_R_10_10_1492501623_1493423999F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at close on 2017-04-28.');
        });

        it('Normal contracts.', () => {
            let param = get_bet_parameters('CALL_R_10_10_1492501916_1492505656_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at 1 hour 2 minutes 20 seconds after contract start time.');
            param = get_bet_parameters('CALL_R_10_10_1492502097_1493596799_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly higher than entry spot at close on 2017-04-30.');
        });
    });

    describe('DIGIT', () => {
        it('DIGITDIFF contracts', () => {
            const param = get_bet_parameters('DIGITDIFF_R_10_2.2_1492408062_5T_4_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 2.2 USD if last digit of Volatility 10 Index is not 4 after 5 ticks.');
        });

        it('DIGITEVEN contracts', () => {
            const param = get_bet_parameters('DIGITEVEN_R_10_3.92_1492410208_5T_0_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 3.92 USD if last digit of Volatility 10 Index is even after 5 ticks.');
        });

        it('DIGITMATCH contracts', () => {
            const param = get_bet_parameters('DIGITMATCH_R_10_18.18_1492407891_5T_4_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 18.18 USD if last digit of Volatility 10 Index is 4 after 5 ticks.');
        });

        it('DIGITODD contracts', () => {
            const param = get_bet_parameters('DIGITODD_R_10_3.92_1492408262_5T_0_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 3.92 USD if last digit of Volatility 10 Index is odd after 5 ticks.');
        });

        it('DIGITOVER contracts', () => {
            const param = get_bet_parameters('DIGITOVER_R_10_4.88_1492408153_5T_5_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 4.88 USD if last digit of Volatility 10 Index is higher than 5 after 5 ticks.');
        });

        it('DIGITUNDER contracts', () => {
            const param = get_bet_parameters('DIGITUNDER_R_10_2.82_1492408225_5T_7_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 2.82 USD if last digit of Volatility 10 Index is lower than 7 after 5 ticks.');
        });
    });

    describe('EXPIRY', () => {
        describe('EXPIRYMISS', () => {
            it('Fixed expiry contracts', () => {
                let param = get_bet_parameters('EXPIRYMISS_R_10_10_1492580629_1492580760F_S1776P_S-1775P', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends outside entry spot minus 1.775 to entry spot plus 1.776 at 2017-04-19 05:46:00 GMT.');
            });

            it('Daily contracts', () => {
                let param = get_bet_parameters('EXPIRYMISS_R_10_10_1492586396_1492732799_10815110000_10811123000', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends outside 10811.123 to 10815.110 at close on 2017-04-20.');
            });

            it('Duration contracts', () => {
                let param = get_bet_parameters('EXPIRYMISS_R_10_10_1492587192_1492592712_S1776P_S-1775P', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends outside entry spot minus 1.775 to entry spot plus 1.776 at 1 hour 32 minutes after contract start time.');
            });
        });

        describe('EXPIRYRANGE', () => {
            it('Fixed expiry contracts', () => {
                let param = get_bet_parameters('EXPIRYRANGE_R_10_10_1492589411_1492590000F_S1776P_S-1775P', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends strictly between entry spot minus 1.775 to entry spot plus 1.776 at 2017-04-19 08:20:00 GMT.');
            });

            it('Daily contracts', () => {
                let param = get_bet_parameters('EXPIRYRANGE_R_10_10_1492589155_1492732799_10860715000_10765447000', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends strictly between 10765.447 to 10860.715 at close on 2017-04-20.');
            });

            it('Duration contracts', () => {
                let param = get_bet_parameters('EXPIRYRANGE_R_10_10_1492588292_1492593812_S1776P_S-1775P', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index ends strictly between entry spot minus 1.775 to entry spot plus 1.776 at 1 hour 32 minutes after contract start time.');
            });
        });
    });

    describe('TOUCH', () => {
        describe('NOTOUCH', () => {
            it('Fixed expiry contracts', () => {
                let param = get_bet_parameters('NOTOUCH_R_10_10_1492592137_1492592280F_S1000P_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index does not touch entry spot plus 1.000 through 2017-04-19 08:58:00 GMT.');
            });
            it('Daily contracts', () => {
                let param = get_bet_parameters('NOTOUCH_R_10_10_1492592475_1492732799_10860715000_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index does not touch 10860.715 through close on 2017-04-20.');
            });
            it('Duration contracts', () => {
                let param = get_bet_parameters('NOTOUCH_R_10_10_1492592618_1492597118_S5000P_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index does not touch entry spot plus 5.000 through 1 hour 15 minutes after contract start time.');
            })
        });

        describe('ONETOUCH', () => {
            it('Fixed expiry contracts', () => {
                let param = get_bet_parameters('ONETOUCH_R_10_10_1492594876_1492617000F_S628P_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index touches entry spot plus 0.628 through 2017-04-19 15:50:00 GMT.');
            });
            it('Daily contracts', () => {
                let param = get_bet_parameters('ONETOUCH_R_10_10_1492594822_1492732799_10862018000_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index touches 10862.018 through close on 2017-04-20.');
            });
            it('Duration contracts', () => {
                let param = get_bet_parameters('ONETOUCH_R_10_10_1492594129_1492599649_S628P_0', 'USD', active_symbols);
                expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index touches entry spot plus 0.628 through 1 hour 32 minutes after contract start time.');
            });
        });
    });

    describe('PUT', () => {
        it('Contract having no barrier and tick as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492596425_5T_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly lower than entry spot.');
        });

        it('Contract having +ve barrier and tick as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492596389_5T_S628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly lower than entry spot plus 0.628.');
        });

        it('Contract having -ve barrier and tick as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492596328_5T_S-628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index after 5 ticks is strictly lower than entry spot minus 0.628.');
        });

        it('Contracts having +ve barrier and hours as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492596187_1492653787_S628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot plus 0.628 at 16 hours after contract start time.')
        });

        it('Contracts having -ve barrier and hours as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492595967_1492653567_S-628P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot minus 0.628 at 16 hours after contract start time.')
        });

        it('Contracts having absolute barrier and days as duration.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492595891_1492732799_10862018000_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than 10862.018 at close on 2017-04-20.')
        });

        it('Forward starting contract.', () => {
            let param = get_bet_parameters('PUT_R_10_10_1492595700F_1492609020_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at 3 hours 42 minutes after 2017-04-19 09:55:00 GMT.');
            param = get_bet_parameters('PUT_R_10_10_1492596300F_1492617000F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at 5 hours 45 minutes after 2017-04-19 10:05:00 GMT.');
        });

        it('Intraday contract having fixed expiry.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492595519_1492617000F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at 2017-04-19 15:50:00 GMT.');
        });

        it('Daily contract having fixed expiry.', () => {
            const param = get_bet_parameters('PUT_R_10_10_1492595588_1492819199F_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at close on 2017-04-21.');
        });

        it('Normal contracts.', () => {
            let param = get_bet_parameters('PUT_R_10_10_1492595816_1492600816_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at 1 hour 23 minutes 20 seconds after contract start time.');
            param = get_bet_parameters('PUT_R_10_10_1492595725_1492732799_S0P_0', 'USD', active_symbols);
            expect(longcode.get(param)).to.equal('Win payout 10 USD if Volatility 10 Index is strictly lower than entry spot at close on 2017-04-20.');
        });
    });
});
