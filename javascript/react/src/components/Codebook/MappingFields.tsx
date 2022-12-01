/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { ActionButton, Label } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'

import { useMappingPairs } from '../../hooks/controls/useMappingPairs.js'
import {
	useHandleDelete,
	useHandleKeyChange,
	useHandleValueChange,
} from '../../hooks/index.js'
import { useHandleAddButtonClick } from './MappingFields.hooks.js'
import { addIconProps, useMappingStyles } from './MappingFields.styles.js'
import type { CodebookMappingFieldProps } from './MappingFields.types.js'

export const MappingFields: React.FC<CodebookMappingFieldProps> = memo(
	function MappingFields(props) {
		const { field, onChangeField, styles, label } = props
		const _styles = useMappingStyles(field.exclude, styles)
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

		const handleRecodeKeyChange = useHandleKeyChange(values, onUpdateMapping)
		const handleRecodeValueChange = useHandleValueChange(
			values,
			field.type,
			onUpdateMapping,
		)
		const handleRecodeDelete = useHandleDelete(values, onUpdateMapping)
		const handleButtonClick = useHandleAddButtonClick(
			onUpdateMapping,
			values,
			field.type,
		)

		const columnPairs = useMappingPairs(
			field.mapping ?? {},
			field.type ?? DataType.String,
			handleRecodeKeyChange,
			handleRecodeValueChange,
			handleRecodeDelete,
			_styles?.dropdownStyles,
			field.exclude,
		)

		return (
			<div style={_styles.root}>
				{label && <Label>{label}</Label>}
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
