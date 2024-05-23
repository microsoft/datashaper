/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ComparisonStrategy,
	type FilterArgs,
	StringComparisonOperator,
} from '@datashaper/schema'

export const filter = (): Omit<FilterArgs, 'column'> => ({
	strategy: ComparisonStrategy.Value,
	operator: StringComparisonOperator.Equals,
})
