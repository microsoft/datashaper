import type { StepComponentProps } from '../types.js'
import { AggregateBase } from './Aggregate.base.js'
import type { AggregateArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Verbs/Aggregate Base',
	component: AggregateBase,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		text: {
			type: { name: 'string', required: true },
			defaultValue: 'This is some detail text',
			description: 'The detail text to show',
			control: { type: 'text' },
		},
	},
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: StepComponentProps<AggregateArgs>) => (
	<AggregateBase {...args} columns={['symbol', 'price', 'date']} />
)

export const Primary = Template.bind({}) as any

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	step: {
		id: 'step-1',
		verb: 'aggregate',
		args: {
			column: 'price',
			groupby: 'symbol',
			operation: FieldAggregateOperation.Mean,
		},
	},
	output: 'output-table',
	onChange: step => console.log('change step', step),
	onChangeOutput: value => console.log('change output to ', value),
} as StepComponentProps<AggregateArgs>
