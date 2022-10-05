/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ParserType } from '../readTable.types.js'
import {
	allUnique,
	determineParserType,
	hasArqueroOptions,
	hasOneChar,
	mapProps,
	validOptions,
} from '../readTable.utils.js'

describe('readTable Utils Tests', () => {
	describe('determineParserType', () => {
		it('should return Arquero', () => {
			const type = determineParserType()
			expect(type).toBe(ParserType.Arquero)
		})
		it('should return Arquero with delimiter', () => {
			const type = determineParserType({ delimiter: ';' })
			expect(type).toBe(ParserType.Arquero)
		})
		it('should return Papa parse', () => {
			const type = determineParserType({ delimiter: ';', skipBlankLines: true })
			expect(type).toBe(ParserType.PapaParse)
		})
	})

	describe('mapProps', () => {
		it('should return Arquero props', () => {
			const options = { delimiter: ';', skipRows: 2 }
			const type = determineParserType(options)
			const mapped = mapProps(type, options)
			const expected = { delimiter: ';', skip: 2, autoType: false }
			expect(mapped).toEqual(expected)
		})
		it('should return Papa parse props', () => {
			const options = { delimiter: ';', comment: '$', skipBlankLines: true }
			const type = determineParserType(options)
			const mapped = mapProps(type, options)
			const expected = {
				delimiter: ';',
				comments: '$',
				skipEmptyLines: true,
				header: true,
			}
			expect(mapped).toEqual(expected)
		})
	})

	describe('hasArqueroOptions', () => {
		it('should return true', () => {
			expect(hasArqueroOptions({ delimiter: ';', skipRows: 2 })).toBe(true)
		})
		it('should return false', () => {
			expect(hasArqueroOptions({ delimiter: ';', escapeChar: '\\' })).toBe(
				false,
			)
		})
	})

	describe('allUnique', () => {
		it('should return true for all unique', () => {
			expect(allUnique(['c1', 'c2', 'C1', 'C2'])).toBe(true)
		})
		it('should return false for no unique values', () => {
			expect(allUnique(['c1', 'c2', 'c1', 'C2'])).toBe(false)
		})
	})

	describe('hasOneChar', () => {
		it('should return true for one delimiter', () => {
			expect(hasOneChar(';')).toBe(true)
		})
		it('should return true with line terminator', () => {
			expect(hasOneChar('\n')).toBe(true)
		})
		it('should return false with 2 line terminators', () => {
			expect(hasOneChar('\r\n')).toBe(false)
		})
	})

	describe('validOptions', () => {
		it('should return true for empty options', () => {
			const valid = validOptions()
			expect(valid).toBe(true)
		})
		it('should return true for some options filled', () => {
			const valid = validOptions({ delimiter: ';', skipRows: 2 })
			expect(valid).toBe(true)
		})
		it('should return true for all options valid', () => {
			const valid = validOptions({
				delimiter: ';',
				names: ['Col1', 'Col2'],
				quoteChar: '"',
				escapeChar: '\\',
				comment: '$',
				lineTerminator: '\n',
			})
			expect(valid).toBe(true)
		})
		it('should return false for two delimiters', () => {
			const valid = validOptions({ delimiter: ';;', skipRows: 2 })
			expect(valid).toBe(false)
		})
		it('undefined value should return true', () => {
			const valid = validOptions({
				delimiter: ';',
				comment: undefined,
				lineTerminator: undefined,
			})
			expect(valid).toBe(true)
		})
		it('should return false', () => {
			const valid = validOptions({
				delimiter: ';',
				names: ['Col1', 'Col2', 'Col2'],
				quoteChar: '"',
				escapeChar: '\\',
				comment: '$',
				lineTerminator: '\n',
			})
			expect(valid).toBe(false)
		})
		it('should return false for two escapeChars', () => {
			const valid = validOptions({
				delimiter: ';',
				names: ['Col1', 'Col2'],
				quoteChar: '"',
				escapeChar: '\\e',
				comment: '$',
				lineTerminator: '\n',
			})
			expect(valid).toBe(false)
		})
	})
})
