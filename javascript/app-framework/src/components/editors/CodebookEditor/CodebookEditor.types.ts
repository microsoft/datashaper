/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookTableStyles } from '@datashaper/react'
import type { Codebook } from '@datashaper/workflow'
import type { PluginComponentProps } from '../types.js'

export interface CodebookEditorProps extends PluginComponentProps {
	resource: Codebook
	styles?: CodebookTableStyles
}
