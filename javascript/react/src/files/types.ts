/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import type { DropzoneOptions, FileRejection } from 'react-dropzone'
export type { DropzoneOptions, FileRejection } from 'react-dropzone'

export interface DzProps {
	acceptedFileTypes: string[]
	onDrop?: (collection: FileCollection) => void
	onDropAccepted?: (collection: FileCollection) => void
	onDropRejected?: (message: string, files?: FileRejection[]) => void
	dropzoneOptions?: Omit<
		DropzoneOptions,
		'onDrop' | 'onDropRejected' | 'onDropAccepted'
	>
}

export interface DropzoneStyles {
	container?: React.CSSProperties
	dragReject?: React.CSSProperties
	placeholder?: React.CSSProperties
	dragZone?: React.CSSProperties
}
