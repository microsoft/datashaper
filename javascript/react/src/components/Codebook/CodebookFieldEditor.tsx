/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, VariableNature } from '@datashaper/schema'
import { Dropdown, TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import {
	useDropdownChange,
	useTextChange,
} from './CodebookFieldEditor.hooks.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import { MappingField } from './MappingField.js'
import { StatsField } from './StatsField.js'

const dataTypeOptions = Object.values(DataType).map(d => ({
	key: d,
	text: d,
}))
const variableNatureOptions = Object.values(VariableNature).map(d => ({
	key: d,
	text: d,
}))
export const CodebookFieldEditor: React.FC<CodebookFieldEditorProps> = memo(
	function CodebookFieldEditor({ field, onChange }) {
		const onChangeField = useCallback(
			(val: any) => {
				onChange({ ...field, ...val })
			},
			[field, onChange],
		)

		const onChangeTextField = useTextChange(onChangeField)
		const onChangeDropdown = useDropdownChange(onChangeField)

		return (
			<Container>
				<StatsField onChange={onChange} field={field}></StatsField>
				<FieldContainer className="field">
					<TextField
						disabled={field.exclude}
						name="displayName"
						value={field.title}
						onChange={onChangeTextField}
					/>
				</FieldContainer>
				<FieldContainer className="field">
					<TextField
						multiline
						disabled={field.exclude}
						rows={3}
						name="description"
						value={field.description}
						onChange={onChangeTextField}
					/>
				</FieldContainer>
				<FieldContainer className="field">
					<Dropdown
						title="type"
						disabled={field.exclude}
						selectedKey={field.type}
						options={dataTypeOptions}
						onChange={onChangeDropdown}
					/>
				</FieldContainer>
				<FieldContainer className="field">
					<Dropdown
						title="nature"
						disabled={field.exclude}
						selectedKey={field.nature}
						options={variableNatureOptions}
						onChange={onChangeDropdown}
					/>
				</FieldContainer>
				<FieldContainer className="field">
					<TextField
						disabled={field.exclude}
						name="unit"
						value={field.unit}
						onChange={onChangeTextField}
					/>
				</FieldContainer>
				<MappingField field={field} onChange={onChange} />
			</Container>
		)
	},
)

const FieldContainer = styled.div``

const Container = styled.div`
	width: 220px;
	border: 1px solid black;

	.field {
		padding: 10px;
	}
	.field:not(:last-child) {
		border-bottom: 1px solid black;
	}
`
