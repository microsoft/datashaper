/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import type React from 'react'

export interface JsonModeEditorProps {
	resource: Resource

	/**
	 * The interactive editor
	 */
	children: React.ReactNode
}
