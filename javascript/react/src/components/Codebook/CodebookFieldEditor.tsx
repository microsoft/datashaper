/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, VariableNature } from '@datashaper/schema'
import { EnumDropdown } from '@essex/components'
import { TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { If, Then } from 'react-if'

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
		visibleFields = DEFAULT_CODEBOOK_FIELDS,
	}) {
		const visibleFieldsSet = new Set<CodebookFields>()
		visibleFields.forEach(unit => {
			visibleFieldsSet.add(unit)
		})

		const onChangeField = useCallback(
			(val: any) => {
				onChange({ ...field, ...val })
			},
			[field, onChange],
		)

		return (
			<Container className="codebook-column">
				<StatsField
					tableView={tableView}
					onChange={onChange}
					field={field}
				></StatsField>
				<If condition={visibleFieldsSet.has(CodebookFields.DisplayName)}>
					<Then>
						{tableView && !hideLabel && <OutsideLabel>Display</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={!tableView && !hideLabel ? 'Display' : undefined}
								borderless
								disabled={field.exclude}
								name="displayName"
								value={field.title}
								onChange={(_, val) => onChangeField({ ...field, title: val })}
							/>
						</FieldContainer>
					</Then>
				</If>
				<If condition={visibleFieldsSet.has(CodebookFields.Description)}>
					<Then>
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
								onChange={(_, val) =>
									onChangeField({ ...field, description: val })
								}
							/>
						</FieldContainer>
					</Then>
				</If>
				<If condition={visibleFieldsSet.has(CodebookFields.DataType)}>
					<Then>
						{tableView && !hideLabel && <OutsideLabel>Data type</OutsideLabel>}
						<FieldContainer className="field">
							<EnumDropdown
								enumeration={DataType}
								styles={{ title: { border: 'unset' } }}
								label={!tableView && !hideLabel ? 'Data type' : undefined}
								title="type"
								disabled={field.exclude}
								selectedKey={field.type}
								onChange={(_, opt) =>
									onChangeField({ ...field, type: opt?.key })
								}
							/>
						</FieldContainer>
					</Then>
				</If>
				<If condition={visibleFieldsSet.has(CodebookFields.DataNature)}>
					<Then>
						{tableView && !hideLabel && (
							<OutsideLabel>Data nature</OutsideLabel>
						)}
						<FieldContainer className="field">
							<EnumDropdown
								styles={{ title: { border: 'unset' } }}
								label={!tableView && !hideLabel ? 'Data nature' : undefined}
								title="nature"
								disabled={field.exclude}
								selectedKey={field.nature}
								enumeration={VariableNature}
								onChange={(_, opt) =>
									onChangeField({ ...field, nature: opt?.key })
								}
							/>
						</FieldContainer>
					</Then>
				</If>
				<If condition={visibleFieldsSet.has(CodebookFields.Units)}>
					<Then>
						{tableView && !hideLabel && <OutsideLabel>Units</OutsideLabel>}
						<FieldContainer className="field">
							<TextField
								label={!tableView && !hideLabel ? 'Units' : undefined}
								borderless
								disabled={field.exclude}
								name="unit"
								value={field.unit}
								onChange={(_, val) => onChangeField({ ...field, unit: val })}
							/>
						</FieldContainer>
					</Then>
				</If>
				<If condition={visibleFieldsSet.has(CodebookFields.Mapping)}>
					<Then>
						{tableView && !hideLabel && <OutsideLabel>Mapping</OutsideLabel>}
						<MappingFields
							field={field}
							hideLabel={!hideLabel}
							tableView={tableView}
							onChange={onChange}
						/>
					</Then>
				</If>
			</Container>
		)
	},
)
