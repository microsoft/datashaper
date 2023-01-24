/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { ActionButton, Label } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'

import { useMappingPairs } from '../../../hooks/controls/useMappingPairs.js'
import {
	useHandleDelete,
	useHandleKeyChange,
	useHandleValueChange
} from '../../../hooks/index.js'
import { useHandleAddButtonClick } from './MappingFields.hooks.js'
import { addIconProps, useMappingStyles } from './MappingFields.styles.js'
import type { CodebookMappingFieldProps } from './MappingFields.types.js'

export const MappingFields: React.FC<CodebookMappingFieldProps> = memo(
	function MappingFields(props) {
		const { field, onChangeField, styles, label } = props
		const _styles = useMappingStyles(styles)
		const [values, setValues] = useState<Record<Value, Value>>(
			field.mapping || {},
		)
		useEffect(() => {
			setValues(field.mapping || {})
		}, [field.mapping])

		const onUpdateMapping = useCallback(
			(mapping: Record<any, any>) => {
				onChangeField?.({ ...field, mapping })
			},
			[onChangeField, field],
		)

		const handleKeyChange = useHandleKeyChange(values, onUpdateMapping)
		const handleValueChange = useHandleValueChange(
			values,
			onUpdateMapping,
		)
		const handleDelete = useHandleDelete(values, onUpdateMapping)
		const handleButtonClick = useHandleAddButtonClick(
			onUpdateMapping,
			values,
		)

		const columnPairs = useMappingPairs(
			field.mapping ?? {},
			field.type ?? DataType.String,
			handleKeyChange,
			handleValueChange,
			handleDelete,
			_styles?.dropdownStyles,
			field.exclude,
		)

		return (
			<div style={_styles.root}>
				{label && <Label styles={_styles.label}>{label}</Label>}
				<div style={_styles?.columnPairs}>{columnPairs}</div>
				<ActionButton
					styles={_styles?.addButton}
					disabled={field.exclude}
					onClick={handleButtonClick}
					iconProps={addIconProps}
				>
					Add mapping
				</ActionButton>
			</div>
		)
	},
)
