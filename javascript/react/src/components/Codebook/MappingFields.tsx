/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import { ActionButton, Checkbox, Label, TextField } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'

import { useTextChange } from './CodebookFieldEditor.hooks.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import {
	useChangeMappingDisplay,
	useChangeMappingNull,
	useChangeMappingValue,
} from './MappingFields.hooks.js'
import {
	FieldLabel,
	FlexColumn,
	MappingContainer,
} from './MappingFields.styles.js'
interface NewValueField {
	value: string
	display: string
}
export const MappingFields: React.FC<CodebookFieldEditorProps> = memo(
	function MappingFields({ field, tableView, onChange, hideLabel }) {
		const [values, setValues] = useState(field.mapping)

		useEffect(() => {
			setValues(field.mapping)
		}, [field.mapping])

		const onChangeMapping = useCallback(
			(mapping: Record<any, any>) => {
				onChange({ ...field, mapping })
			},
			[onChange],
		)

		const onChangeValue = useChangeMappingValue(onChangeMapping, values)
		const onChangeDisplay = useChangeMappingDisplay(onChangeMapping, values)
		const onChangeNull = useChangeMappingNull(onChangeMapping, values)

		return (
			<FlexColumn className="field">
				{!tableView && !hideLabel ? (
					<Label disabled={field.exclude}>Mapping</Label>
				) : null}
				{values &&
					Object.keys(values).map((value: any, index: number) => (
						<MappingContainer key={index}>
							<FlexColumn style={valueStyle}>
								{index === 0 && (
									<FieldLabel disabled={field.exclude}>Value</FieldLabel>
								)}
								<TextField
									disabled={field.exclude}
									name="value"
									value={value}
									onChange={(_, newValue) => onChangeValue(value, newValue)}
								/>
							</FlexColumn>
							<FlexColumn style={displayStyle}>
								{index === 0 && (
									<FieldLabel disabled={field.exclude}>Display</FieldLabel>
								)}
								<TextField
									disabled={field.exclude || values[value] === null}
									name="display"
									value={values[value] ?? ''}
									onChange={(_, val) => onChangeDisplay(value, val)}
								/>
							</FlexColumn>
							<FlexColumn style={valueStyle}>
								{index === 0 && <FieldLabel>Null</FieldLabel>}
								<Checkbox
									onChange={(_, val) => onChangeNull(value, val)}
									disabled={field.exclude}
								/>
							</FlexColumn>
						</MappingContainer>
					))}
				<MappingAddField
					field={field}
					values={values}
					onAdd={onChangeMapping}
				></MappingAddField>
			</FlexColumn>
		)
	},
)

const MappingAddField: React.FC<{
	onAdd: (mapping: Record<any, any>) => void
	field: Field
	values?: Record<any, any>
}> = memo(function MappingField({ onAdd, field, values }) {
	const [newValue, setNewValue] = useState<NewValueField | undefined>()

	const onChangeField = useCallback(
		(val: any) => {
			setNewValue({ ...newValue, ...val })
		},
		[newValue, setNewValue],
	)
	const onTextChange = useTextChange(onChangeField)

	const onAddField = useCallback(() => {
		if (!newValue?.value || !newValue?.display) return
		const mapping = {
			...values,
			[newValue.value]: newValue.display,
		}
		setNewValue(undefined)
		onAdd(mapping)
	}, [newValue, values, onAdd, field, setNewValue])

	return (
		<MappingContainer>
			<FlexColumn style={valueStyle}>
				{!values && <FieldLabel disabled={field.exclude}>Value</FieldLabel>}
				<TextField
					disabled={field.exclude}
					name="value"
					value={newValue?.value ?? ''}
					onChange={onTextChange}
				/>
			</FlexColumn>
			<FlexColumn style={displayStyle}>
				{!values && <FieldLabel disabled={field.exclude}>Display</FieldLabel>}
				<TextField
					disabled={field.exclude}
					name="display"
					value={newValue?.display ?? ''}
					onChange={onTextChange}
				/>
			</FlexColumn>
			<FlexColumn style={addButtonStyle}>
				<ActionButton
					disabled={!newValue?.value || !newValue?.display}
					onClick={onAddField}
				>
					Add
				</ActionButton>
			</FlexColumn>
		</MappingContainer>
	)
})

const addButtonStyle = { flex: 1, alignSelf: 'self-end' }
const displayStyle = { flex: 2 }
const valueStyle = { flex: 1 }
