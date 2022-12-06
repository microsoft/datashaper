/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@datashaper/schema'
import { EnumDropdown } from '@essex/components'
import type { IDropdownOption } from '@fluentui/react'
import type { FormEvent } from 'react'
import { memo, useCallback } from 'react'

import type { CodebookEnumDropdownFieldProps } from './Codebook.types.js'

export const CodebookDataTypeField: React.FC<CodebookEnumDropdownFieldProps> =
	memo(function CodebookDataTypeField(props) {
		const { field, onChange, onChangeField } = props

		const onChangeValue = useCallback(
			(
				event: FormEvent<HTMLDivElement>,
				option?: IDropdownOption<any>,
				index?: number | undefined,
			) => {
				onChangeField?.({ ...field, type: option?.key as DataType })
				onChange?.(event, option, index)
			},
			[onChange, onChangeField, field],
		)

		return (
			<EnumDropdown
				title="type"
				disabled={field.exclude}
				selectedKey={field.type}
				{...props}
				onChange={onChangeValue}
			/>
		)
	})
