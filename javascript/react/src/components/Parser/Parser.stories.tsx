/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import type { ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { Parser } from './Parser.js'

const storyMetadata = {
	title: 'Components/Parser',
	component: Parser,
	argTypes: {},
}
export default storyMetadata

const parserOptions: ParserOptions = {
	delimiter: ',',
}

const Template: ComponentStory<typeof Parser> = ({ ...args }): JSX.Element => {
	const [parser, setParser] = useState<ParserOptions>(parserOptions)
	console.log('parser', parser)
	return (
		<div
			style={{
				width: 240,
			}}
		>
			<Parser parser={parser} onChange={setParser} {...args} />
		</div>
	)
}

export const ParserOptionsStory = Template.bind({})
ParserOptionsStory.storyName = 'Parser'
