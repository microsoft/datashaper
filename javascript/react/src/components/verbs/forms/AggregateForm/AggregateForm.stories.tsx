/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'

import type { StepFormProps } from '../types.js'
import { AggregateFormBase } from './AggregateForm.base.js'

const storyMetadata = {
	title: 'Verbs/Aggregate Base',
	component: AggregateFormBase,
}
export default storyMetadata

const Template = (args: StepFormProps<AggregateArgs>) => (
	<AggregateFormBase {...args} columns={['symbol', 'price', 'date']} />
)

export const Primary = Template.bind({}) as any as {
	args: StepFormProps<AggregateArgs>
}

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
} as StepFormProps<AggregateArgs>
