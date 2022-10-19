/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeArgs } from '@datashaper/schema'

import type { StepComponentProps } from '../types.js'
import { EncodeBase } from './Encode.base.js'

const storyMetadata = {
	title: 'Verbs/Encode Base',
	component: EncodeBase,
}
export default storyMetadata

const Template = (args: StepComponentProps<EncodeArgs>) => (
	<EncodeBase {...args} columns={['symbol', 'price', 'date']} />
)

export const Primary = Template.bind({}) as any as {
	args: StepComponentProps<EncodeArgs>
}

Primary.args = {
	step: {
		id: 'step-1',
		verb: 'encode',
		args: {
			applyMapping: true,
		},
	},
	output: 'output-table',
	onChange: step => console.log('change step', step),
	onChangeOutput: value => console.log('change output to ', value),
} as StepComponentProps<EncodeArgs>
