import { Longcode } from '../src/longcode.js';
import { expect } from 'chai';

describe('Main module', () => {
  let active_symbols;

  before(() => {
    active_symbols = [{
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
  });

  it('Constructor test', () => {
    let sp = new Longcode(active_symbols, 'EUR');
    expect(sp.getCurrentCurrency()).to.equal('EUR');
    sp = new Longcode(active_symbols);
    expect(sp.getCurrentCurrency()).to.equal('USD');
    expect(sp.getCurrentLanguage()).to.equal('en');
    expect(() => { new Longcode() }).to.throw('Param 1 containing active_symbols is missing.');
  });

  it('Returns bet parameter', () => {
    let sp = new Longcode(active_symbols, 'en', 'EUR');
    expect(sp.getBetParameters('CALL_R_10_70.73_1492407012_5T_S1366P_0')).to.deep.equal({
      amount: 70.73,
      amount_type: 'payout',
      barrier: '1.366',
      barrier_count: 1,
      bet_type: 'CALL',
      currency: 'EUR',
      date_start: 1492407012,
      shortcode: 'CALL_R_10_70.73_1492407012_5T_S1366P_0',
      tick_count: 5,
      tick_expiry: 1,
      underlying: 'Volatility 10 Index',
      underlying_symbol: 'R_10'
    });
  });

  it('Returns longcode', () => {
    let longcode = new Longcode(active_symbols, 'en', 'EUR');
    expect(longcode.get('EXPIRYRANGE_RDBULL_10_1492589411_1492590000F_S1776P_S-1775P')).to.equal('Win payout 10 EUR if Bull' +
      ' Market Index ends strictly between entry spot minus 0.1775 to entry spot plus 0.1776 at 2017-04-19 08:20:00 GMT.');
  });
});
