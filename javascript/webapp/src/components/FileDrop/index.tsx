/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropzone } from '@data-wrangling-components/react'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileExtensions } from '@data-wrangling-components/utilities'
import { memo } from 'react'

export interface FileDropProps {
	onDrop?: (collection: FileCollection) => void
	// full text to print in drop down
	text?: string
	// supported file extensions
	// TODO: if extensions are supplied, then can be used to filter the dropped list
	extensions?: string[]
}

export const FileDrop: React.FC<FileDropProps> = memo(function FileDrop({
	onDrop,
	text,
	extensions = [FileExtensions.csv],
}) {
	return (
		<Dropzone
			placeholder={text}
			onDrop={onDrop}
			acceptedFileTypes={extensions}
		/>
	)
})
