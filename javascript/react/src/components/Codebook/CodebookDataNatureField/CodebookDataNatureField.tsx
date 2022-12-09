/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EnumDropdown } from '@essex/components'
import { memo } from 'react'

import type { CodebookEnumDropdownFieldProps } from '../types.js'
import { useOnChangeValue } from './CodebookDataNatureField.hooks.js'

export const CodebookDataNatureField: React.FC<CodebookEnumDropdownFieldProps> =
	memo(function CodebookDataNatureField(props) {
		const { field } = props
		const onChangeValue = useOnChangeValue(props)

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
