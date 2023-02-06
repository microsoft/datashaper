/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox } from '@fluentui/react'
import { type FormEvent, memo, useCallback, useRef } from 'react'

import { FieldName, Flex } from './CodebookNameField.styles.js'
import type { CodebookNameFieldProps } from './CodebookNameField.types.js'

export const CodebookNameField: React.FC<CodebookNameFieldProps> = memo(
	function CodebookNameField(props) {
		const { field, onChangeField, styles, checkbox } = props

		const wrapperRef = useRef<HTMLDivElement | null>(null)

		const onChangeValue = useCallback(
			(
				_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
				checked?: boolean | undefined,
			) => {
				onChangeField?.({ ...field, exclude: !checked })
				checkbox?.onChange?.(_, checked)
			},
			[onChangeField, checkbox, field],
		)

		return (
			<div ref={wrapperRef} style={styles?.root}>
				<Flex>
					<Checkbox
						styles={styles?.checkbox}
						checked={!field.exclude}
						{...checkbox}
						onChange={onChangeValue}
					/>
					<FieldName disabled={field.exclude}>{field.name}</FieldName>
				</Flex>
			</div>
		)
	},
)
