/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import { memo, useCallback, useState } from 'react'

import {
	Container,
	OtherTextField,
	RadioGroup,
	choiceGroupStyles,
} from './TableDelimiterOptions.styles.js'

export const TableDelimiterOptions: React.FC<{
	onChange: (option: string) => void
	selected?: string
}> = memo(function TableDelimiterOptions({ onChange, selected }) {
	const [isOther, { setTrue: customDelimiter, setFalse: presetDelimiter }] =
		useBoolean(false)
	const [value, setValue] = useState(isOther ? selected : '')

	const onDelimiterChange = useCallback(
		(option?: IChoiceGroupOption) => {
			if (option?.key === 'Other') {
				customDelimiter()
				onChange('')
			} else if (option) {
				presetDelimiter()
				onChange(option.key)
			}
		},
		[customDelimiter, presetDelimiter, onChange],
	)

	const debouncedChange = useDebounceFn(
		(newValue: string) => onChange(newValue),
		{
			wait: 250,
		},
	)

	const onChangeCustomDelimiter = useCallback(
		(
			_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			newValue?: string,
		) => {
			if (!newValue || newValue.length <= 1) {
				setValue(newValue)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				debouncedChange.run(newValue || '')
			}
		},
		[debouncedChange, setValue],
	)

	return (
		<Container>
			<RadioGroup
				defaultSelectedKey={selected}
				options={delimiterOptions}
				onChange={(_: any, option: IChoiceGroupOption) =>
					onDelimiterChange(option)
				}
				styles={choiceGroupStyles}
			/>
			<OtherTextField
				autoComplete='off'
				title='custom delimiter'
				name='customDelimiter'
				disabled={!isOther}
				value={value}
				onChange={onChangeCustomDelimiter}
			/>
		</Container>
	)
})

const delimiterOptions: IChoiceGroupOption[] = [
	{ key: ',', text: 'Comma' },
	{ key: '\t', text: 'Tab' },
	{ key: ' ', text: 'Space' },
	{ key: ';', text: 'Semicolon' },
	{ key: 'Other', text: 'Other: ' },
]
