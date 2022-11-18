/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'

import type { CodebookFields } from './CodebookFieldEditor.types.js'

export interface CodebookTableEditorProps {
	fields: Field[]
	onChange: (fields: Field[]) => void
	visibleFields?: CodebookFields[]
	hideLabel?: boolean
}
