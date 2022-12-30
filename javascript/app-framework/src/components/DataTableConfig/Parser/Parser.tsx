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
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useEffect } from 'react'

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
	const [headers, { toggle: toggleHeaders }] = useBoolean(!parser.names?.length)

	useEffect(() => {
		if (headers && !!parser.names?.length) {
			parser.names = undefined
		}
	}, [headers, parser])

	return (
		<Container>
			<FlexContainer>
				<Delimiter
					selected={parser.delimiter}
					onChange={(delim: string) => (parser.delimiter = delim)}
				/>
			</FlexContainer>
			<Expando label="Advanced" styles={expandoStyles}>
				<FlexContainer>
					<Headers
						headers={parser.names}
						headersChecked={headers}
						toggleHeaders={toggleHeaders}
						onChange={(value: string[] | undefined) => (parser.names = value)}
					/>
					<FieldContainer>
						<SpinButton
							labelPosition={Position.top}
							label="Skip rows"
							value={parser.skipRows.toString()}
							min={0}
							step={1}
							onChange={(_, value) => (parser.skipRows = +(value as string))}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
						<SpinButton
							labelPosition={Position.top}
							label="Read rows"
							value={parser.readRows.toString()}
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
