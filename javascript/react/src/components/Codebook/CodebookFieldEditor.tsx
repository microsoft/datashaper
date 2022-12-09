/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, VariableNature } from '@datashaper/schema'
import { memo } from 'react'

import { useDefaultCodebookStyles } from './Codebook.styles.js'
import { CodebookDataNatureField } from './CodebookDataNatureField.js'
import { CodebookDataTypeField } from './CodebookDataTypeField.js'
import { CodebookDescriptionField } from './CodebookDescriptionField.js'
import { CodebookDisplayNameField } from './CodebookDisplayNameField.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import { CodebookStatsField } from './CodebookStatsField.js'
import { CodebookUnitField } from './CodebookUnitField.js'
import { MappingFields } from './MappingFields.js'

export const CodebookFieldEditor: React.FC<CodebookFieldEditorProps> = memo(
	function CodebookFieldEditor({ styles, field, onChangeField }) {
		const _styles = useDefaultCodebookStyles(styles)

		return (
			<div style={_styles.root}>
				<CodebookStatsField
					styles={_styles.statsWrapper}
					onChangeField={onChangeField}
					field={field}
				/>
				<CodebookDisplayNameField
					label="Display name"
					field={field}
					styles={_styles.displayName}
					onChangeField={onChangeField}
				/>

				<CodebookDescriptionField
					label="Description"
					field={field}
					styles={_styles.description}
					onChangeField={onChangeField}
				/>
				<CodebookDataTypeField
					enumeration={DataType}
					field={field}
					label="Data type"
					styles={_styles.dataType}
					onChangeField={onChangeField}
				/>
				<CodebookDataNatureField
					enumeration={VariableNature}
					field={field}
					label="Data nature"
					styles={_styles.dataNature}
					onChangeField={onChangeField}
				/>
				<CodebookUnitField
					label="Units"
					field={field}
					styles={_styles.units}
					onChangeField={onChangeField}
				/>
				<MappingFields
					label="Mapping"
					styles={_styles?.mapping}
					field={field}
					onChangeField={onChangeField}
				/>
			</div>
		)
	},
)
