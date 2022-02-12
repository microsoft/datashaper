/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileCollection } from '@data-wrangling-components/utilities'
import type { FileRejection, DropzoneOptions } from 'react-dropzone'
export type { FileRejection, DropzoneOptions } from 'react-dropzone'

export interface DropFilesCount {
	total: number
	completed: number
}

export interface DropzoneProps extends DzProps {
	placeholder?: string
	styles?: {
		container?: React.CSSProperties
		dragReject?: React.CSSProperties
		placeholder?: React.CSSProperties
		dragZone?: React.CSSProperties
	}
	disabled?: boolean
	loading?: boolean
	filesCount?: DropFilesCount
}
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
