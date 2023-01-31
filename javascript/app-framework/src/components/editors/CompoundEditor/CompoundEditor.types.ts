/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'

export interface EditorConfig {
	key: string
	title: string
	iconName: string
	renderer: any
}

export interface CompoundEditorProps {
	resource: Resource
	editors: EditorConfig[]
}
