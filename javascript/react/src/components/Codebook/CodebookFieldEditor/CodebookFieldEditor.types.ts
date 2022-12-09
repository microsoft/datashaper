/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CodebookMappingStyles } from '../MappingFields/index.js'
import type { CodebookPropsBase, CodebookStyles } from '../types.js'

export interface CodebookFieldEditorStyles extends CodebookStyles {
	mapping?: CodebookMappingStyles
}
export interface CodebookFieldEditorProps extends CodebookPropsBase {
	styles?: CodebookFieldEditorStyles
}
