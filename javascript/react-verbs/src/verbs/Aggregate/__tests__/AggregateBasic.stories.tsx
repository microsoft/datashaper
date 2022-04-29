/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldAggregateOperation, Verb } from '@data-wrangling-components/core'

import { AggregateBasic } from '../AggregateBasic.js'

const meta = {
	title: 'Aggregate',
	meta: {
		browsers: ['chrome'],
	},
}
export default meta

export const Basic: React.FC = () => (
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
		onChange={(...e: any) => console.log('onchange', ...e)}
	/>
)
