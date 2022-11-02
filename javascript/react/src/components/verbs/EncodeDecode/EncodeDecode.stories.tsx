/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeDecodeArgs } from '@datashaper/schema'
import { CodebookStrategy } from '@datashaper/schema'

import type { StepComponentProps } from '../types.js.js'
import { EncodeDecodeBase } from './EncodeDecode.base.js'

const storyMetadata = {
	title: 'Verbs/Encode Base',
	component: EncodeDecodeBase,
}
export default storyMetadata

const Template = (args: StepComponentProps<EncodeDecodeArgs>) => (
	<EncodeDecodeBase {...args} />
)

export const Primary = Template.bind({}) as any as {
	args: StepComponentProps<EncodeDecodeArgs>
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
	onChange: step => console.log('change step', step),
	onChangeOutput: value => console.log('change output to ', value),
} as StepComponentProps<EncodeDecodeArgs>
