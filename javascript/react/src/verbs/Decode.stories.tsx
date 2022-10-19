/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DecodeArgs } from '@datashaper/schema'

import type { StepComponentProps } from '../types.js'
import { DecodeBase } from './Decode.base.js'

const storyMetadata = {
	title: 'Verbs/Decode Base',
	component: DecodeBase,
}
export default storyMetadata

const Template = (args: StepComponentProps<DecodeArgs>) => (
	<DecodeBase {...args} columns={['symbol', 'price', 'date']} />
)

export const Primary = Template.bind({}) as any as {
	args: StepComponentProps<DecodeArgs>
}

Primary.args = {
	step: {
		id: 'step-1',
		verb: 'decode',
		args: {
			applyMapping: true,
		},
	},
	output: 'output-table',
	onChange: step => console.log('change step', step),
	onChangeOutput: value => console.log('change output to ', value),
} as StepComponentProps<DecodeArgs>
