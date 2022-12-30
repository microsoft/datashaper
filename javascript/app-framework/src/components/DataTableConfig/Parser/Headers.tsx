/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, TextField } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { memo, useCallback, useState } from 'react'

import { Container } from './Parser.styles.js'

export const Headers: React.FC<{
	headers: string[] | undefined
	onChange: (val: string[] | undefined) => void
	headersChecked: boolean
	toggleHeaders: () => void
}> = memo(function HeadersOption({
	headersChecked,
	toggleHeaders,
	headers,
	onChange,
}) {
	const [value, setValue] = useState(headers?.join(','))

	const handleValueChange = useDebounceFn(
		() => {
			onChange(value?.trim().split(','))
		},
		{ wait: 1000 },
	)

	const onChangeValue = useCallback(
		(
			_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			val?: string,
		) => {
			setValue(val)
			handleValueChange.run() // eslint-disable-line
		},
		[setValue, handleValueChange],
	)

	return (
		<Container>
			<Checkbox
				label="Headers in first row"
				checked={headersChecked}
				onChange={toggleHeaders}
			/>
			{!headersChecked && (
				<TextField
					multiline
					label={'Header names (comma-separated)'}
					value={value}
					onChange={onChangeValue}
				/>
			)}
		</Container>
	)
})
