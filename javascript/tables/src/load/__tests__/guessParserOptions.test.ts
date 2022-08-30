/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'

import { guessDelimiter } from '../guessDelimiter.js'

const pipeTable = `first|second|third
1|100|one
3|200|two
3|300|three
4|400|four
5|500|five`

const colonTable = `1:100:one
2:2,100,1:two
3:300:three
4:400:four
5:500:five`

const tooManyData = `index;int;float;boolean;string;date;array;obj
0;100;1.01;yes;aaa;8/15/2022;"[1,2,3]";"{""a"":123,""b"":""BBBB"",""c"":""FALSE"",""d"":"""",""e"":""undefined""}"
1;1000;1.55;no;bbb;2022-08-06T03:01:23;"[""a"", ""b""]";
2;3456;0.58;t;ccc;Fri Aug 12 2022 17:14:07 GMT-0500 (Colombia Standard Time);"[""false"",""TRUE""]";
3;NA;12258.569;f;ddd;Fri Aug 07 2022;"[""1"",""2""]";
4;1;987.3654;TRUE;eee;Fri Aug 09 2022;"[""NaN"",""NULL""]";
5;33;458.258;FALSE;fff;2022-08-08T22:15:01.263Z;"[1.22, 0.45]";
6;30;4548.56;n/a;ggg;1659737701263;"[""false"", 1]";
7;20;8989;-nan;hhh;"Fri; 19 Aug 2022 22:16:16 GMT";"[""2022-05-30"",""Fri Aug 26 2022""]";
8;NaN;-448.99;0;iii;3/25/2022;"[23, ""undefined"",""a""]";
9;0;NULL;1;jjj;12/1/2019;"[""undefined"", ""null"", 1]";`

const defaultTable = `1,100,one
2,200,two
3,300,three
4,400,four
5,500,five`

const tabTable = fs.readFileSync('./src/load/__tests__/delim-test.csv', {
	encoding: 'utf8',
	flag: 'r',
})

const semicolon = `first;second
2;Fri, 19 Aug 2022 22:16:16 GMT
3;Fri, 19 Aug 2022 22:16:16 GMT`

describe('guess Delimiter', () => {
	it('return default delimiter', () => {
		const delimiter = guessDelimiter(defaultTable)
		expect(delimiter).toBe(',')
	})
	it('guess delimiter : passing it in the props list', () => {
		const delimiter = guessDelimiter(colonTable, {
			delimitersToGuess: [':', ';', ','],
		})
		expect(delimiter).toBe(':')
	})
	it('guess delimiter default with pipe table', () => {
		const delimiter = guessDelimiter(pipeTable)
		expect(delimiter).toBe('|')
	})
	it('guess delimiter tab', () => {
		const delimiter = guessDelimiter(tabTable)
		expect(delimiter).toBe('\t')
	})
	it('a lot of different data delimiter return ;', () => {
		const delimiter = guessDelimiter(tooManyData)
		expect(delimiter).toBe(';')
	})
	it('guess delimiter ;', () => {
		const delimiter = guessDelimiter(semicolon)
		expect(delimiter).toBe(';')
	})
})
