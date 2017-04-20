import { find } from './utils';

/**
 * Created by Apoorv Joshi on 17/04/2017
 * @param {*} shortcode
 * @param {*} currency
 * @param {*} is_sold
 */
export const get_bet_parameters = (shortcode, currency, active_symbols) => {
    let parameters = {
        bet_type: 'Invalid',
        underlying: 'config',
        currency: currency
    };
    if (!active_symbols)
        throw 'Active Symbols list not present';
    //Contracts with barrier
    let match = shortcode.match(/^([^_]+)_([\w\d^_]+)_(\d*\.?\d*)_(\d+F?)_(\d+[FT]?)_(S?-?\d+P?)_(S?-?\d+P?)/);
    if (!match) { // Contracts without barriers. Eg: 'Asians'. (Not being racist, it is actually a contract type. Believe me!)
        match = shortcode.match(/^([^_]+)_([\w\d^_]+)_(\d*\.?\d*)_(\d+F?)_(\d+[FT]?)/);
        if (match) {
            const underlying = find(active_symbols, underlying => underlying.symbol.toUpperCase() === match[2].toUpperCase());
            if (!underlying)
                throw 'Underlying not found';
            parameters = {
                barrier_count: 0,
                shortcode: match[0],
                bet_type: match[1],
                underlying: underlying.display_name,
                underlying_symbol: match[2],
                amount_type: 'payout',
                amount: +match[3],
                date_start: +match[4],
                tick_expiry: 1,
                tick_count: +match[5].toUpperCase().replace('T', '')
            }
        }
    } else { // Normal contracts with at least 1 barrier.
        const underlying = find(active_symbols, underlying => underlying.symbol.toUpperCase() === match[2].toUpperCase());
        if (!underlying)
            throw 'Underlying not found';
        const digits_after_decimal = underlying.pip ? ('' + underlying.pip).split('.')[1].length : 2;
        parameters = {
            shortcode: match[0],
            bet_type: match[1],
            underlying_symbol: match[2],
            underlying: underlying.display_name,
            amount_type: 'payout',
            amount: +match[3],
            date_start: +match[4].toUpperCase().replace('F', '')
        }
        if (match[4].toUpperCase().indexOf('F') !== -1) parameters.is_forward_starting = 1;
        if (match[5].toUpperCase().indexOf('T') !== -1) { // Tick trade
            parameters.tick_expiry = 1;
            parameters.tick_count = +match[5].toUpperCase().replace('T', '');
        } else {
            if (match[5].toUpperCase().indexOf('F') !== -1) parameters.fixed_expiry = 1;
            parameters.date_expiry = +match[5].toUpperCase().replace('F', '')
        }
        if (match[6] === 'S0P' || +match[6] === 0) { // No barrier
            parameters.barrier_count = 0;
        } else if (match[7] === 'S0P' || +match[7] === 0) { //Only one barrier available
            parameters.barrier_count = 1;
            if (match[6].startsWith('S') && match[6].endsWith('P')) { //Relative barrier
                match[6] = match[6].replace('S', '').replace('P', '')
                parameters.barrier = (match[6] * underlying.pip).toFixed(digits_after_decimal);
            } else { //Absolute barrier
                parameters.barrier_absolute = 1;
                parameters.barrier = match[1].startsWith('DIGIT') ? match[6] : (match[6] / 1000000).toFixed(digits_after_decimal);
            }
        } else { // Two barriers available
            parameters.barrier_count = 2;
            if (match[6].startsWith('S') && match[6].endsWith('P')) { //Relative Barrier
                match[6] = match[6].replace('S', '').replace('P', '');
                match[7] = match[7].replace('S', '').replace('P', '')
                parameters.high_barrier = (match[6] * underlying.pip).toFixed(digits_after_decimal);
                parameters.low_barrier = (match[7] * underlying.pip).toFixed(digits_after_decimal);
            } else { //Absolute barrier
                parameters.barrier_absolute = 1;
                parameters.high_barrier = match[1].startsWith('DIGIT') ? +match[6] : (+match[6] / 1000000).toFixed(digits_after_decimal);
                parameters.low_barrier = match[1].startsWith('DIGIT') ? +match[7] : (+match[7] / 1000000).toFixed(digits_after_decimal);
            }
        }
    }

    parameters.currency = currency;

    return parameters;
}
