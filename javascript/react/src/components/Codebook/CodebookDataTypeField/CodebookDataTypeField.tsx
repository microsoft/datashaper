/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EnumDropdown } from '@essex/components'
import { memo } from 'react'

import type { CodebookEnumDropdownFieldProps } from '../types.js'
import { useOnChangeValue } from './CodebookDataTypeField.hooks.js'

export const CodebookDataTypeField: React.FC<CodebookEnumDropdownFieldProps> =
	memo(function CodebookDataTypeField(props) {
		const { field } = props
		const onChangeValue = useOnChangeValue(props)

		return (
			<EnumDropdown
				title='type'
				disabled={field.exclude}
				selectedKey={field.type}
				{...props}
				onChange={onChangeValue}
			/>
		)
	})
