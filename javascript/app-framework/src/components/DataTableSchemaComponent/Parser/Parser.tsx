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
import { memo, useCallback, useEffect } from 'react'

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

export const Parser: React.FC<ParserProps> = memo(function Parser({
	parser = {},
	onChange,
}) {
	const [headers, { toggle: toggleHeaders }] = useBoolean(!parser.names?.length)

	useEffect(() => {
		if (headers && !!parser.names?.length) {
			parser.names = undefined
		}
	}, [headers, parser])

	const onChangeParser = useCallback(
		(
			option: string | boolean | number | string[] | undefined,
			optName: string,
		) => {
			const update = {
				...parser,
				[optName]: option,
			}
			onChange?.(update)
		},
		[parser, onChange],
	)

	return (
		<Container>
			<FlexContainer>
				<Delimiter
					selected={parser.delimiter}
					onChange={(delim: string) => onChangeParser(delim, 'delimiter')}
				/>
			</FlexContainer>
			<Expando label="Advanced" styles={expandoStyles}>
				<FlexContainer>
					<Headers
						headers={parser.names}
						headersChecked={headers}
						toggleHeaders={toggleHeaders}
						onChange={(value: string[] | undefined) => {
							onChangeParser(value, 'names')
						}}
					/>
					<FieldContainer>
						<SpinButton
							labelPosition={Position.top}
							label="Skip rows"
							value={parser.skipRows?.toString()}
							min={0}
							step={1}
							onChange={(_, value) =>
								onChangeParser(+(value as string), 'skipRows')
							}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
						<SpinButton
							labelPosition={Position.top}
							label="Read rows"
							value={parser.readRows?.toString()}
							min={0}
							step={1}
							onChange={(_, value) =>
								onChangeParser(+(value as string), 'readRows')
							}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
					</FieldContainer>
					<TextField
						label="Comment character"
						onChange={(_, value) => {
							onChangeParser(value, 'comment')
						}}
						value={parser.comment}
					/>
					<ChoiceGroup
						disabled
						label={'Line terminator'}
						title="Option temporarily disabled"
						selectedKey={parser.lineTerminator}
						options={lineTerminatorOptions}
						onChange={(_, option) =>
							onChangeParser(option?.key, 'lineTerminator')
						}
					/>
					<TextField
						label="Quote character"
						disabled
						title="Option temporarily disabled"
						onChange={(_, value) => onChangeParser(value, 'quoteChar')}
						value={parser.quoteChar}
					/>
					<TextField
						label="Escape character"
						disabled
						title="Option temporarily disabled"
						onChange={(_, value) => onChangeParser(value, 'escapeChar')}
						value={parser.escapeChar}
					/>

					<Checkbox
						label="Skip blank lines"
						disabled
						title="Option temporarily disabled"
						checked={parser.skipBlankLines}
						onChange={(_, value) => onChangeParser(value, 'skipBlankLines')}
					/>
				</FlexContainer>
			</Expando>
		</Container>
	)
})
