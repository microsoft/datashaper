/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookTableStyles } from '@datashaper/react'
import type { Codebook } from '@datashaper/workflow'

export interface CodebookEditorProps {
	resource: Codebook
	styles?: CodebookTableStyles
}
