# shortcode_processing
This project is used for converting [**Binary.com**](https://www.binary.com) provided short-code to long-code.

Usage:
----
If you have `npm` installed, use:
```
$ npm install binary-com-longcode --save
```
For `yarn`, use:
```
$ yarn add binary-com-longcode
```

In code: (requires `moment`)
```
import moment from 'moment';
import {Longcode} from 'binary-com-longcode';

const longcodeGenerator = new Longcode(active_symbols, language, currency);
console.log(longcodeGenerator.get('some_short_code'));

```
Or:
```
var moment = require('moment');
var longcode = require('binary-com-longcode').Longcode;
var longcodeGenerator = new Longcode(active_symbols, language, currency);

console.log(longcodeGenerator.get('some_short_code'));
```
