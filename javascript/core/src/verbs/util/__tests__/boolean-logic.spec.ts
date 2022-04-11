import { and, nand, nor, or, xor } from '../boolean-logic.js'

describe('boolean logic', () => {
	describe('or', () => {
		test('empty', () => {
			expect(or([])).toBeNull()
		})

		test('single value', () => {
			expect(or([1])).toBe(1)
			expect(or([0])).toBe(0)
			expect(or([null])).toBeNull()
		})

		test('two values', () => {
			expect(or([1, 0])).toBe(1)
			expect(or([0, 0])).toBe(0)
			expect(or([1, null])).toBe(1)
			expect(or([0, null])).toBeNull()
		})

		test('more values', () => {
			expect(or([1, 0, 1])).toBe(1)
			expect(or([0, 0, 0])).toBe(0)
			expect(or([1, null, 0])).toBe(1)
			expect(or([0, null, 1])).toBe(1)
			expect(or([0, null, 0])).toBeNull()
		})
	})

	describe('and', () => {
		test('empty', () => {
			expect(and([])).toBeNull()
		})

		test('single value', () => {
			expect(and([1])).toBe(1)
			expect(and([0])).toBe(0)
			expect(and([null])).toBeNull()
		})

		test('two values', () => {
			expect(and([1, 0])).toBe(0)
			expect(and([0, 0])).toBe(0)
			expect(and([1, 1])).toBe(1)
			expect(and([0, null])).toBe(0)
			expect(and([1, null])).toBeNull()
		})

		test('more values', () => {
			expect(and([1, 0, 1])).toBe(0)
			expect(and([0, 0, 0])).toBe(0)
			expect(and([1, 1, 1])).toBe(1)
			expect(and([1, null, 0])).toBe(0)
			expect(and([0, null, 1])).toBe(0)
			expect(and([1, null, 1])).toBeNull()
		})
	})

	describe('xor', () => {
		test('empty', () => {
			expect(xor([])).toBeNull()
		})

		test('single value', () => {
			expect(xor([1])).toBe(1)
			expect(xor([0])).toBe(0)
			expect(xor([null])).toBeNull()
		})

		test('two values', () => {
			expect(xor([1, 0])).toBe(1)
			expect(xor([0, 0])).toBe(0)
			expect(xor([1, 1])).toBe(0)
			expect(xor([0, null])).toBeNull()
			expect(xor([1, null])).toBeNull()
		})

		test('more values', () => {
			expect(xor([1, 0, 0])).toBe(1)
			expect(xor([0, 0, 0])).toBe(0)
			expect(xor([1, 1, 1])).toBe(0)
			expect(xor([1, null, 1])).toBe(0)
			expect(xor([0, null, 1])).toBeNull()
			expect(xor([0, null, 0])).toBeNull()
		})
	})

	describe('nor', () => {
		test('empty', () => {
			expect(nor([])).toBeNull()
		})

		test('single value', () => {
			expect(nor([1])).toBe(0)
			expect(nor([0])).toBe(1)
			expect(nor([null])).toBeNull()
		})

		test('two values', () => {
			expect(nor([1, 0])).toBe(0)
			expect(nor([0, 0])).toBe(1)
			expect(nor([1, 1])).toBe(0)
			expect(nor([1, null])).toBe(0)
			expect(nor([0, null])).toBeNull()
		})

		test('more values', () => {
			expect(nor([1, 0, 0])).toBe(0)
			expect(nor([0, 0, 0])).toBe(1)
			expect(nor([1, 1, 1])).toBe(0)
			expect(nor([1, null, 1])).toBe(0)
			expect(nor([0, null, 1])).toBe(0)
			expect(nor([0, null, 0])).toBeNull()
		})
	})

	describe('nand', () => {
		test('empty', () => {
			expect(nand([])).toBeNull()
		})

		test('single value', () => {
			expect(nand([1])).toBe(0)
			expect(nand([0])).toBe(1)
			expect(nand([null])).toBeNull()
		})

		test('two values', () => {
			expect(nand([1, 0])).toBe(1)
			expect(nand([0, 0])).toBe(1)
			expect(nand([1, 1])).toBe(0)
			expect(nand([0, null])).toBe(1)
			expect(nand([1, null])).toBeNull()
		})

		test('more values', () => {
			expect(nand([1, 0, 0])).toBe(1)
			expect(nand([0, 0, 0])).toBe(1)
			expect(nand([1, 1, 1])).toBe(0)
			expect(nand([0, null, 1])).toBe(1)
			expect(nand([0, null, 0])).toBe(1)
			expect(nand([1, null, 1])).toBeNull()
		})
	})
})
