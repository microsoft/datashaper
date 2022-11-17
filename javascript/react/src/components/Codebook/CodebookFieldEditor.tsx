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
import { MappingField } from './MappingField.js'
import { StatsField } from './StatsField.js'

export const CodebookFieldEditor: React.FC<CodebookFieldEditorProps> = memo(
	function CodebookFieldEditor({
		field,
		onChange,
		showInlineLabel,
		showOutsideLabel = false,
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
				<StatsField onChange={onChange} field={field}></StatsField>
				{showFields.includes(CodebookFields.DisplayName) && (
					<>
						{showOutsideLabel && <OutsideLabel>Display</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={showInlineLabel ? 'Display name' : undefined}
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
						{showOutsideLabel && <OutsideLabel>Description</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={showInlineLabel ? 'Description' : undefined}
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
						{showOutsideLabel && <OutsideLabel>Data type</OutsideLabel>}
						<FieldContainer className="field">
							<Dropdown
								label={showInlineLabel ? 'Data type' : undefined}
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
						{showOutsideLabel && <OutsideLabel>Data nature</OutsideLabel>}
						<FieldContainer className="field">
							<Dropdown
								label={showInlineLabel ? 'Data nature' : undefined}
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
						{showOutsideLabel && <OutsideLabel>Units</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={showInlineLabel ? 'Units' : undefined}
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
						{showOutsideLabel && <OutsideLabel>Mapping</OutsideLabel>}
						<MappingField
							field={field}
							showInlineLabel={showInlineLabel}
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
