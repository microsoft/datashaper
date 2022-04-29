/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation,Verb } from '@data-wrangling-components/core'

import { AggregateBasic } from '../AggregateBasic.js'

export default {
	title: 'Aggregate',
	meta: {
		browsers: ['chrome'],
	},
}

export const Basic = () => (
	<AggregateBasic
		step={{
			id: 'agg1',
			verb: Verb.Aggregate,
			args: {
				groupby: 'ticker',
				column: 'price',
				operation: FieldAggregateOperation.Mean,
				to: 'mean_price',
			},
			input: {},
			output: {},
		}}
		columnOptions={[]}
		onChange={(...e) => console.log('onchange', ...e)}
	/>
)
