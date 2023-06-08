/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/workflow'
import { Checkbox, TextField } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback, useState } from 'react'

import { Container } from './Parser.styles.js'

export const Headers: React.FC<{
	parser: ParserOptions
}> = memo(function HeadersOption({ parser }) {
	const [value, setValue] = useState(parser.names?.join(','))

	const handleValueChange = useDebounceFn(
		() => {
			parser.names = value?.trim().split(',')
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

	const header = useObservableState(parser.header$)
	return (
		<Container>
			<Checkbox
				label='Headers in first row'
				checked={header}
				onChange={(_, value) => (parser.header = value)}
			/>
			{!header && (
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
