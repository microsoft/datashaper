/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'

export enum CodebookFields {
	DisplayName = 'display name',
	Description = 'description',
	DataType = 'data type',
	DataNature = 'data nature',
	Units = 'units',
	Mapping = 'mapping',
}

export interface CodebookFieldEditorProps {
	field: Field
	onChange: (field: Field) => void
	showInlineLabel?: boolean
	showFields?: CodebookFields[]
}
