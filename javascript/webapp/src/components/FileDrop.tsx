/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropzone } from '@datashaper/react'
import { FileExtensions } from '@datashaper/utilities'
import { memo } from 'react'

import type { FileDropProps } from './FileDrop.types.js'

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
