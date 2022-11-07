/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'

import type { StepFormProps } from '../types.js'
import { BinFormBase } from './BinForm.base.js'

const storyMetadata = {
	title: 'Verbs/Bin Base',
	component: BinFormBase,
}
export default storyMetadata

const Template = (args: StepFormProps<BinArgs>) => <BinFormBase {...args} />

export const Primary = Template.bind({}) as any as {
	args: StepFormProps<BinArgs>
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
} as StepFormProps<BinArgs>
