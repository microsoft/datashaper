/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'

import type { StepComponentProps } from '../types.js'
import { AggregateBase } from './Aggregate.base.js'

const storyMetadata = {
	title: 'Verbs/Aggregate Base',
	component: AggregateBase,
}
export default storyMetadata

const Template = (args: StepComponentProps<AggregateArgs>) => (
	<AggregateBase {...args} columns={['symbol', 'price', 'date']} />
)

export const Primary = Template.bind({}) as any as {
	args: StepComponentProps<AggregateArgs>
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
} as StepComponentProps<AggregateArgs>
