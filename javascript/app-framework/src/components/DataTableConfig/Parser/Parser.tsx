/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Expando } from '@essex/components'
import {
	Checkbox,
	ChoiceGroup,
	Position,
	SpinButton,
	TextField,
} from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'

import { Delimiter } from './Delimiter.js'
import { Headers } from './Headers.js'
import {
	Container,
	expandoStyles,
	FieldContainer,
	FlexContainer,
} from './Parser.styles.js'
import type { ParserProps } from './Parser.types.js'

const lineTerminatorOptions = [
	{ key: '\r', text: '\\r' },
	{ key: '\n', text: '\\n' },
	{ key: '\r\n', text: '\\r\\n' },
]

export const Parser: React.FC<ParserProps> = memo(function Parser({ parser }) {
	const skipRows = useObservableState(parser.skipRows$, parser.skipRows)
	const readRows = useObservableState(parser.readRows$, parser.readRows)
	const delimiter = useObservableState(parser.delimiter$, parser.delimiter)
	return (
		<Container>
			<FlexContainer>
				<Delimiter
					selected={delimiter}
					onChange={(delim: string) => (parser.delimiter = delim)}
				/>
			</FlexContainer>
			<Expando label="Advanced" styles={expandoStyles}>
				<FlexContainer>
					<Headers parser={parser} />
					<FieldContainer>
						<SpinButton
							labelPosition={Position.top}
							label="Skip rows"
							value={skipRows?.toString()}
							min={0}
							step={1}
							onChange={(_, value) => (parser.skipRows = +(value as string))}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
						<SpinButton
							disabled
							title="Option temporarily disabled"
							labelPosition={Position.top}
							label="Read rows"
							value={readRows?.toString()}
							min={0}
							step={1}
							onChange={(_, value) => (parser.readRows = +(value as string))}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
					</FieldContainer>
					<TextField
						label="Comment character"
						onChange={(_, value) => (parser.comment = value)}
						value={parser.comment}
					/>
					<ChoiceGroup
						disabled
						label={'Line terminator'}
						title="Option temporarily disabled"
						selectedKey={parser.lineTerminator}
						options={lineTerminatorOptions}
						onChange={(_, option) => (parser.lineTerminator = option?.key)}
					/>
					<TextField
						label="Quote character"
						disabled
						title="Option temporarily disabled"
						onChange={(_, value) => (parser.quoteChar = value)}
						value={parser.quoteChar}
					/>
					<TextField
						label="Escape character"
						disabled
						title="Option temporarily disabled"
						onChange={(_, value) => (parser.escapeChar = value)}
						value={parser.escapeChar}
					/>

					<Checkbox
						label="Skip blank lines"
						disabled
						title="Option temporarily disabled"
						checked={parser.skipBlankLines}
						onChange={(_, value) => (parser.skipBlankLines = value)}
					/>
				</FlexContainer>
			</Expando>
		</Container>
	)
})
