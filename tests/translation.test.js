import { Translation } from '../src/translation.js';
import { expect } from 'chai';

describe("Translations", () => {
    let translate;
    before(() => {
        const t = new Translation('test');
        translate = (...args) => {
            return t.translate(...args);
        }
    });

    it("Returns the string if no translation is present.", () => {
        expect(translate('Hello')).to.equal('Hello');
    });

    it("Returns the string after replacing var in it if no translation is present.", () => {
        expect(translate('Hello [_n]!', { _n: 'John Doe' }))
            .to.equal('Hello John Doe!');
    });

    it("Returns translated string.", () => {
        expect(translate('Enter a comma separated list of user names.'))
            .to.equal('Eine kommagetrennte Liste von Benutzernamen.');
    });

    it("Returns translated string and replaces variable in it.", () => {
        expect(translate('How are you [name]?', { name: 'John Doe' }))
            .to.equal('Wie geht es dir John Doe?');
    });

    it("Returns untranslated singular string based on variable and replaces variable in it.", () => {
        expect(translate('[_n] Hour', '[_n] Hours', { _n: 1 }))
            .to.equal('1 Hour');
    });

    it("Returns untranslated plural string based on variable and replaces variable in it.", () => {
        expect(translate('[_n] Hour', '[_n] Hours', { _n: 2 }))
            .to.equal('2 Hours');
        expect(translate('[_n] Hour', '[_n] Hours', { _n: 0 }))
            .to.equal('0 Hours');
    });

    it("Returns translated singular string based on variable and replaces variable in it.", () => {
        expect(translate('[_n] Second', '[_n] Seconds', { _n: 1 }))
            .to.equal('1 Sekunde');
    });

    it("Returns translated plural string based on variable and replaces variable in it.", () => {
        expect(translate('[_n] Second', '[_n] Seconds', { _n: 2 }))
            .to.equal('2 Sekunden');
        expect(translate('[_n] Second', '[_n] Seconds', { _n: 0 }))
            .to.equal('0 Sekunden');
    });
})
