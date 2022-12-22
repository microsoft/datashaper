/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType, VariableNature } from '@datashaper/schema'
import { memo } from 'react'

import { CodebookDataNatureField } from '../CodebookDataNatureField/index.js'
import { CodebookDataTypeField } from '../CodebookDataTypeField/index.js'
import { CodebookDescriptionField } from '../CodebookDescriptionField/index.js'
import { CodebookDisplayNameField } from '../CodebookDisplayNameField/index.js'
import { CodebookStatsField } from '../CodebookStatsField/index.js'
import { CodebookUnitField } from '../CodebookUnitField/index.js'
import { MappingFields } from '../MappingFields/MappingFields.js'
import { useFieldEditorStyles } from './CodebookFieldEditor.styles.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'

export const CodebookFieldEditor: React.FC<CodebookFieldEditorProps> = memo(
	function CodebookFieldEditor({ styles, field, onChangeField }) {
		const _styles = useFieldEditorStyles(styles)
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
