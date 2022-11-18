/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, VariableNature } from '@datashaper/schema'
import { Dropdown, TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'

import {
	useDropdownChange,
	useTextChange,
} from './CodebookFieldEditor.hooks.js'
import {
	Container,
	FieldContainer,
	OutsideLabel,
} from './CodebookFieldEditor.styles.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import {
	CodebookFields,
	DEFAULT_CODEBOOK_FIELDS,
} from './CodebookFieldEditor.types.js'
import { MappingFields } from './MappingFields.js'
import { StatsField } from './StatsField.js'

export const CodebookFieldEditor: React.FC<CodebookFieldEditorProps> = memo(
	function CodebookFieldEditor({
		field,
		onChange,
		tableView,
		hideLabel,
		showFields = DEFAULT_CODEBOOK_FIELDS,
	}) {
		const onChangeField = useCallback(
			(val: any) => {
				onChange({ ...field, ...val })
			},
			[field, onChange],
		)

		const onChangeTextField = useTextChange(onChangeField)
		const onChangeDropdown = useDropdownChange(onChangeField)

		return (
			<Container className="codebook-column">
				<StatsField
					tableView={tableView}
					onChange={onChange}
					field={field}
				></StatsField>
				{showFields.includes(CodebookFields.DisplayName) && (
					<>
						{tableView && !hideLabel && <OutsideLabel>Display</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={!tableView && !hideLabel ? 'Display' : undefined}
								borderless
								disabled={field.exclude}
								name="displayName"
								value={field.title}
								onChange={onChangeTextField}
							/>
						</FieldContainer>
					</>
				)}
				{showFields.includes(CodebookFields.Description) && (
					<>
						{tableView && !hideLabel && (
							<OutsideLabel>Description</OutsideLabel>
						)}
						<FieldContainer className="field">
							<TextField
								label={!tableView && !hideLabel ? 'Description' : undefined}
								borderless
								multiline
								resizable={false}
								disabled={field.exclude}
								rows={3}
								name="description"
								value={field.description}
								onChange={onChangeTextField}
							/>
						</FieldContainer>
					</>
				)}
				{showFields.includes(CodebookFields.DataType) && (
					<>
						{tableView && !hideLabel && <OutsideLabel>Data type</OutsideLabel>}
						<FieldContainer className="field">
							<Dropdown
								styles={{ title: { border: 'unset' } }}
								label={!tableView && !hideLabel ? 'Data type' : undefined}
								title="type"
								disabled={field.exclude}
								selectedKey={field.type}
								options={dataTypeOptions}
								onChange={(_, opt) => onChangeDropdown('type', opt)}
							/>
						</FieldContainer>
					</>
				)}
				{showFields.includes(CodebookFields.DataNature) && (
					<>
						{tableView && !hideLabel && (
							<OutsideLabel>Data nature</OutsideLabel>
						)}
						<FieldContainer className="field">
							<Dropdown
								styles={{ title: { border: 'unset' } }}
								label={!tableView && !hideLabel ? 'Data nature' : undefined}
								title="nature"
								disabled={field.exclude}
								selectedKey={field.nature}
								options={variableNatureOptions}
								onChange={(_, opt) => onChangeDropdown('nature', opt)}
							/>
						</FieldContainer>
					</>
				)}

				{showFields.includes(CodebookFields.Units) && (
					<>
						{tableView && !hideLabel && <OutsideLabel>Units</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={!tableView && !hideLabel ? 'Units' : undefined}
								borderless
								disabled={field.exclude}
								name="unit"
								value={field.unit}
								onChange={onChangeTextField}
							/>
						</FieldContainer>
					</>
				)}
				{showFields.includes(CodebookFields.Mapping) && (
					<>
						{tableView && !hideLabel && <OutsideLabel>Mapping</OutsideLabel>}
						<MappingFields
							field={field}
							hideLabel={!hideLabel}
							tableView={tableView}
							onChange={onChange}
						/>
					</>
				)}
			</Container>
		)
	},
)

const dataTypeOptions = Object.values(DataType).map(d => ({
	key: d,
	text: d,
}))
const variableNatureOptions = Object.values(VariableNature).map(d => ({
	key: d,
	text: d,
}))
