import { get_bet_parameters as getParameters } from './get_bet_parameters.js';
import { LongCode } from './longcode_generator.js';

export class Longcode {
  constructor(...args) {
    if (typeof args[0] !== 'object')
      throw 'Param 1 containing active_symbols is missing.';
    this.active_symbols = args[0];
    this.lang = this.isLangSupported(args[1]) ? args[1] : 'en'; // EN is fallback language.
    this.currency = args[2] ? args[2] : this.isLangSupported(args[1]) ? 'USD' : args[1] ? args[1] : 'USD';
    this.longcode_gen = new LongCode(this.lang);
  }

  getActiveSymbols() {
    return this.active_symbols;
  }

  getBetParameters(shortcode) {
    return getParameters(shortcode, this.currency, this.active_symbols);
  }

  getCurrentLanguage() {
    return this.lang;
  }

  getCurrentCurrency() {
    return this.currency;
  }

  get(shortcode) {
    const bet_param = this.getBetParameters(shortcode);
    return this.longcode_gen.get(bet_param);
  }

  setCurrentLanguage(lang) {
    this.lang = lang;
  }

  setCurrentCurrency(curr) {
    this.currency = curr;
  }

  isLangSupported(lang) {
    lang = (lang || '').trim().toLowerCase();
    return lang === 'ar' || lang === 'de' || lang === 'en' || lang === 'es' || lang === 'fr' || lang === 'id' || lang === 'it' || lang === 'th'
      || lang === 'ja' || lang === 'pl' || lang === 'pt' || lang === 'ru' || lang === 'vi' || lang === 'zn_cn' || lang === 'zh_tw';
  }
}

export default {
  Longcode
}
