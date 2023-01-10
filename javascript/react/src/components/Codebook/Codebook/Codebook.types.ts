/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'

import type { CodebookStyles } from '../types.js'

/**
 * Props for the CodebookEditor component
 */
export interface CodebookProps {
	fields: Field[]
	metadata?: TableMetadata
	onChangeFields: (fields: Field[]) => void
	styles?: CodebookTableStyles
}

export interface CodebookTableStyles extends CodebookStyles {
	tableWrapper?: React.CSSProperties
	labelWrapper?: React.CSSProperties
}
