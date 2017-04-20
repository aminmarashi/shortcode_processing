import { Translation } from '../src/translation.js';
import moment from 'moment';

export class LongCode {

  constructor(lang) {
    this.t = new Translation(lang);
  }

  // Returns longcode based on bet parameters.
  get(bet_param) {
    const _this = this;
    const t = this.t;
    bet_param = this.processBarrier(bet_param);
    const contract_map = {
      ASIANU: (param) => {
        return t.translate('Win payout [amount] [currency] if the last tick of [underlying] is strictly higher than the average of the [tick_count] ticks.', param);
      },
      ASIAND: (param) => {
        return t.translate('Win payout [amount] [currency] if the last tick of [underlying] is strictly lower than the average of the [tick_count] ticks.', param);
      },
      CALL: (param) => {
        if (param.tick_expiry === 1) { // Tick trade
          return t.translate('Win payout [amount] [currency] if [underlying] after [tick_count] ticks is strictly higher than [entry_spot].', param)
        }

        if (param.is_forward_starting === 1) {
          param.duration = _this.getDuration(param.date_expiry - param.date_start);
          param.date_start = _this.getDateTime(param.date_start);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly higher than [entry_spot] at [duration] after [date_start].', param)
        }

        if (_this.isDaily(param.date_expiry - param.date_start)) {
          // Daily normal constracts.
          param.date_expiry = 'close on ' + _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly higher than [entry_spot] at [date_expiry].', param)
        }

        if (param.fixed_expiry === 1) { //Fixed expiry
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly higher than [entry_spot] at [date_expiry].', param)
        }
        // Intraday normal contracts having duration in minutes, seconds, or hours.
        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] is strictly higher than [entry_spot] at [duration] after contract start time.', param)
      },
      DIGITDIFF: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is not [barrier] after [tick_count] ticks.', param);
      },
      DIGITEVEN: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is even after [tick_count] ticks.', param);
      },
      DIGITMATCH: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is [barrier] after [tick_count] ticks.', param);
      },
      DIGITODD: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is odd after [tick_count] ticks.', param);
      },
      DIGITOVER: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is higher than [barrier] after [tick_count] ticks.', param);
      },
      DIGITUNDER: (param) => {
        return t.translate('Win payout [amount] [currency] if last digit of [underlying] is lower than [barrier] after [tick_count] ticks.', param);
      },
      EXPIRYMISS: (param) => {
        if (_this.isDaily(param.date_expiry - param.date_start)) {
          param.date_expiry = _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] ends outside [low_barrier_str] to [high_barrier_str] at close on [date_expiry].', param);
        }

        if (param.fixed_expiry === 1) {
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] ends outside [low_barrier_str] to [high_barrier_str] at [date_expiry].', param);
        }

        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] ends outside [low_barrier_str] to [high_barrier_str] at [duration] after contract start time.', param);
      },
      EXPIRYRANGE: (param) => {

        if (_this.isDaily(param.date_expiry - param.date_start)) {
          param.date_expiry = _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] ends strictly between [low_barrier_str] to [high_barrier_str] at close on [date_expiry].', param);
        }

        if (param.fixed_expiry === 1) {
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] ends strictly between [low_barrier_str] to [high_barrier_str] at [date_expiry].', param);
        }

        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] ends strictly between [low_barrier_str] to [high_barrier_str] at [duration] after contract start time.', param);
      },
      NOTOUCH: (param) => {
        if (_this.isDaily(param.date_expiry - param.date_start)) {
          param.date_expiry = _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] does not touch [entry_spot] through close on [date_expiry].', param);
        }

        if (param.fixed_expiry === 1) {
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] does not touch [entry_spot] through [date_expiry].', param);
        }

        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] does not touch [entry_spot] through [duration] after contract start time.', param);
      },
      ONETOUCH: (param) => {
        if (_this.isDaily(param.date_expiry - param.date_start)) {
          param.date_expiry = _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] touches [entry_spot] through close on [date_expiry].', param);
        }

        if (param.fixed_expiry === 1) {
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] touches [entry_spot] through [date_expiry].', param);
        }

        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] touches [entry_spot] through [duration] after contract start time.', param);
      },
      PUT: (param) => {
        if (param.tick_expiry === 1) { // Tick trade
          return t.translate('Win payout [amount] [currency] if [underlying] after [tick_count] ticks is strictly lower than [entry_spot].', param)
        }

        if (param.is_forward_starting === 1) {
          param.duration = _this.getDuration(param.date_expiry - param.date_start);
          param.date_start = _this.getDateTime(param.date_start);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly lower than [entry_spot] at [duration] after [date_start].', param)
        }

        if (_this.isDaily(param.date_expiry - param.date_start)) {
          // Daily normal constracts.
          param.date_expiry = 'close on ' + _this.getDate(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly lower than [entry_spot] at [date_expiry].', param)
        }

        if (param.fixed_expiry === 1) { //Fixed expiry
          param.date_expiry = _this.getDateTime(param.date_expiry);
          return t.translate('Win payout [amount] [currency] if [underlying] is strictly lower than [entry_spot] at [date_expiry].', param)
        }
        // Intraday normal contracts having duration in minutes, seconds, or hours.
        param.duration = _this.getDuration(param.date_expiry - param.date_start);
        return t.translate('Win payout [amount] [currency] if [underlying] is strictly lower than [entry_spot] at [duration] after contract start time.', param)
      }
    };

    return contract_map[bet_param.bet_type](bet_param);
  }

  //Returns duration in humanized format. Eg: 12 hours 1 minute 20 seconds
  getDuration(diff) {
    const duration = moment.duration(diff * 1000);
    const t = this.t;
    let duration_str = '';
    if (duration.days()) duration_str += t.translate('[n] day', '[n] days', {
      n: duration.days()
    });
    if (duration.hours())
      duration_str += duration_str ? ' ' + t.translate('[n] hour', '[n] hours', {
        n: duration.hours()
      }) : t.translate('[n] hour', '[n] hours', {
        n: duration.hours()
      });
    if (duration.minutes())
      duration_str += duration_str ? ' ' + t.translate('[n] minute', '[n] minutes', {
        n: duration.minutes()
      }) : t.translate('[n] minute', '[n] minutes', {
        n: duration.minutes()
      });
    if (duration.seconds())
      duration_str += duration_str ? ' ' + t.translate('[n] second', '[n] seconds', {
        n: duration.seconds()
      }) : t.translate('[n] second', '[n] seconds', {
        n: duration.seconds()
      });

    return duration_str;
  }

  //Converts time stamp to date.
  getDateTime(ts) {
    return moment.utc(ts * 1000).format('YYYY-MM-DD HH:mm:ss') + ' GMT';
  }

  //Returns the date from timestamp.
  getDate(ts) {
    return moment.utc(ts * 1000).format('YYYY-MM-DD');
  }

  //Checks if contract is daily.
  isDaily(diff) {
    return moment.duration(diff * 1000).days() > 0;
  }

  processBarrier(param) {
    if (param.barrier_count === 0) {
      param.entry_spot = 'entry spot';
    } else if (param.barrier_count === 1) {
      if (param.barrier_absolute === 1) {
        param.entry_spot = param.barrier;
      } else {
        if (param.barrier > 0)
          param.entry_spot = 'entry spot plus ' + param.barrier.replace(/^[\+\-]/g, '');
        else
          param.entry_spot = 'entry spot minus ' + param.barrier.replace(/^[\+\-]/g, '');
      }
    } else if (param.barrier_absolute) {
      param.low_barrier_str = param.low_barrier;
      param.high_barrier_str = param.high_barrier;
    } else {
      param.low_barrier_str = param.low_barrier > 0 ? 'entry spot plus ' + param.low_barrier.replace(/^[\+\-]/g, '') :
        param.low_barrier < 0 ? 'entry spot minus ' + param.low_barrier.replace(/^[\+\-]/g, '') : 'entry spot';
      param.high_barrier_str = param.high_barrier > 0 ? 'entry spot plus ' + param.high_barrier.replace(/^[\+\-]/g, '') :
        param.high_barrier < 0 ? 'entry spot minus ' + param.high_barrier.replace(/^[\+\-]/g, '') : 'entry spot';
    }

    return param;
  }

}
