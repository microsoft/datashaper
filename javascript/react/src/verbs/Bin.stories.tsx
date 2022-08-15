/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/core'
import { BinStrategy } from '@datashaper/core'

import type { StepComponentProps } from '../types.js'
import { BinBase } from './Bin.base.js'

const storyMetadata = {
	title: 'Verbs/Bin Base',
	component: BinBase,
}
export default storyMetadata

const Template = (args: StepComponentProps<BinArgs>) => <BinBase {...args} />

export const Primary = Template.bind({}) as any as {
	args: StepComponentProps<BinArgs>
}

Primary.args = {
	step: {
		id: 'step-1',
		verb: 'bin',
		args: {
			column: 'price',
			strategy: BinStrategy.FixedCount,
			fixedcount: 10,
		},
	},
	output: 'output-table',
	onChange: step => console.log('change step', step),
	onChangeOutput: value => console.log('change output to ', value),
} as StepComponentProps<BinArgs>
