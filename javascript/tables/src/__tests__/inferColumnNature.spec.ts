/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

describe('Infer column nature tests', () => {
	describe('mostLikelyNature', () => {
		/*mostLikelyNature: VariableNature
	possibleNatures: VariableNature[]
	hasMissingData?: boolean
	isInteger?: boolean
	isNumber?: boolean
	isString?: boolean
	uniqueValues?: boolean[] | string[] | number[]
	uniquePresentValues?: boolean[] | string[] | number[]*/

		it('should return true', () => {
			expect(true).toBe(true)
		})
		it('should return false', () => {
			expect(false).toBe(false)
		})
	})
})
