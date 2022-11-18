/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { ActionButton } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
	useHandleDelete,
	useHandleKeyChange,
	useHandleValueChange,
} from '../../hooks/index.js'
import { useMappingPairs } from '../controls/MappingFields/MappingFields.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import { useHandleAddButtonClick } from './MappingFields.hooks.js'

export const MappingFields: React.FC<CodebookFieldEditorProps> = memo(
	function MappingFields({ field, onChange }) {
		const [values, setValues] = useState<Record<Value, Value>>(
			field.mapping || {},
		)

		useEffect(() => {
			setValues(field.mapping || {})
		}, [field.mapping])

		const onUpdateMapping = useCallback(
			(mapping: Record<any, any>) => {
				onChange({ ...field, mapping })
			},
			[onChange, field],
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
			dropdownStyles,
		)

		return (
			<Container>
				<ColumnPairs>{columnPairs}</ColumnPairs>
				<ActionButton onClick={handleButtonClick} iconProps={addIconProps}>
					Add mapping
				</ActionButton>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
`
const ColumnPairs = styled.div`
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 5px;
`

const addIconProps = { iconName: 'Add' }
const dropdownStyles = { root: { width: 92 } }
