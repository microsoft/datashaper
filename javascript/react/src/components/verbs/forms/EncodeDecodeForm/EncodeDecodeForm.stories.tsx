/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeDecodeArgs } from '@datashaper/schema'
import { CodebookStrategy } from '@datashaper/schema'

import type { StepFormProps } from '../types.js'
import { EncodeDecodeFormBase } from './EncodeDecodeForm.base.js'

const storyMetadata = {
	title: 'Verbs/Encode Base',
	component: EncodeDecodeFormBase,
}
export default storyMetadata

const Template = (args: StepFormProps<EncodeDecodeArgs>) => (
	<EncodeDecodeFormBase {...args} />
)

export const Primary = Template.bind({}) as any as {
	args: StepFormProps<EncodeDecodeArgs>
}

Primary.args = {
	step: {
		id: 'step-1',
		verb: 'encode',
		args: {
			strategy: CodebookStrategy.MappingOnly,
		},
	},
	output: 'output-table',
	onChange: (step) => console.log('change step', step),
	onChangeOutput: (value) => console.log('change output to ', value),
} as StepFormProps<EncodeDecodeArgs>
