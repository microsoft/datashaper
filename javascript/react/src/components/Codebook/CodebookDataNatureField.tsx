/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableNature } from '@datashaper/schema'
import { EnumDropdown } from '@essex/components'
import type { IDropdownOption } from '@fluentui/react'
import type { FormEvent } from 'react'
import { memo, useCallback } from 'react'

import type { CodebookEnumDropdownFieldProps } from './Codebook.types.js'

export const CodebookDataNatureField: React.FC<CodebookEnumDropdownFieldProps> =
	memo(function CodebookDataNatureField(props) {
		const { field, onChange, onChangeField } = props

		const onChangeValue = useCallback(
			(
				event: FormEvent<HTMLDivElement>,
				option?: IDropdownOption<any>,
				index?: number | undefined,
			) => {
				onChangeField?.({ ...field, nature: option?.key as VariableNature })
				onChange?.(event, option, index)
			},
			[onChange, onChangeField, field],
		)

		return (
			<EnumDropdown
				title="nature"
				disabled={field.exclude}
				selectedKey={field.nature}
				{...props}
				onChange={onChangeValue}
			/>
		)
	})
