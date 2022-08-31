import { NumericComparisonOperator } from '@datashaper/schema'

import { compareValues } from '../compare.js'

// NOTE: most of the comparison operators are tested indirectly
// in the expressions spec. This test file was created so we can start
// testing the underlying logical operations directly, but they haven't
// all been migrated.
describe('compare', () => {
	describe('numeric', () => {
		test('equals', () => {
			expect(compareValues(1, 1, NumericComparisonOperator.Equals)).toBe(1)

			expect(compareValues(1, 0, NumericComparisonOperator.Equals)).toBe(0)

			expect(compareValues(42, 1, NumericComparisonOperator.Equals)).toBe(0)
		})
	})
})
