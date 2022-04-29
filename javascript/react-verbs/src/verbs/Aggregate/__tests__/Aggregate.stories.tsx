import { Aggregate } from '../Aggregate.js'
import { Verb, FieldAggregateOperation } from '@data-wrangling-components/core'

const meta = {
	description: 'Aggregate',
}
export default meta

export const Basic = () => (
	<Aggregate
		step={{
			id: 'abc',
			args: {
				groupby: 'country',
				operation: FieldAggregateOperation.Sum,
				column: 'population',
				to: 'total',
			},
			verb: Verb.Aggregate,
		}}
	/>
)
