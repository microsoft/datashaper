/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'

export interface CodebookFieldEditorProps {
	field: Field
	onChange: (field: Field) => void
}
