/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CodebookDefaultProps,
	CodebookDefaultStyles,
} from './Codebook.types.js'
import type { CodebookMappingStyles } from './MappingFields.types.js'

export interface CodebookFieldEditorStyles extends CodebookDefaultStyles {
	mapping?: CodebookMappingStyles
}
export interface CodebookFieldEditorProps extends CodebookDefaultProps {
	styles?: CodebookFieldEditorStyles
}
