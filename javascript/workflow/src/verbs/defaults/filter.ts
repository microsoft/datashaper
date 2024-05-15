/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterCompareType,
	type FilterArgs,
	StringComparisonOperator,
} from '@datashaper/schema'

export const filter = (): Omit<FilterArgs, 'column'> => ({
	criteria: {
		type: FilterCompareType.Value,
		operator: StringComparisonOperator.Equals,
	},
})
