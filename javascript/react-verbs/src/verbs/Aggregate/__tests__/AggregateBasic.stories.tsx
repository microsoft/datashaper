import { AggregateBasic } from '../AggregateBasic.js'
import { Verb, FieldAggregateOperation } from '@data-wrangling-components/core'

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
