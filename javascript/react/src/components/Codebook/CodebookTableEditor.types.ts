/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'

import type { CodebookStyles } from './Codebook.types.js'

export interface CodebookTableEditorProps {
	fields: Field[]
	onChangeFields: (fields: Field[]) => void
	styles?: CodebookTableStyles
}

export interface CodebookTableStyles extends CodebookStyles {
	tableWrapper?: React.CSSProperties
	labelWrapper?: React.CSSProperties
}
