/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FileCollection } from '@data-wrangling-components/utilities'

export interface FileDropProps {
	onDrop?: (collection: FileCollection) => void
	// full text to print in drop down
	text?: string
	// supported file extensions
	// TODO: if extensions are supplied, then can be used to filter the dropped list
	extensions?: string[]
}
