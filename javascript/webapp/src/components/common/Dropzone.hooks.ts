/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileWithPath } from '@datashaper/utilities'
import { FileCollection, FileMimeType } from '@datashaper/utilities'
import debug from 'debug'
import { useCallback } from 'react'
import type { DropzoneState as DzState } from 'react-dropzone'
import { useDropzone as UseDz } from 'react-dropzone'

import type { DropzoneProps, FileRejection } from './Dropzone.types.js'

const log = debug('datashaper')

export interface DropzoneState extends DzState {
	acceptedFileTypesExt: string[]
}

export function useDropzone({
	acceptedFileTypes,
	onDrop,
	onDropRejected,
	onDropAccepted,
	dropzoneOptions,
}: DropzoneProps): DropzoneState {
	const handleOnDrop = useHandleOnDrop(onDrop)
	const handleOnDropAccepted = useHandleOnDropAccepted(onDropAccepted)
	const acceptedFileTypesExt = acceptedFileTypes.map((x) =>
		x.toLowerCase().includes('application') || x.toLowerCase().includes('text')
			? FileMimeType[x as keyof typeof FileMimeType]
			: x,
	)
	const handleOnDropRejected = useHandleOnDropRejected(
		acceptedFileTypesExt,
		onDropRejected,
	)
	const state = UseDz({
		onDrop(files: File[]) {
			void handleOnDrop(files as FileWithPath[])
		},
		onDropAccepted(files: File[]) {
			void handleOnDropAccepted(files as FileWithPath[])
		},
		onDropRejected: handleOnDropRejected,
		accept: acceptedFileTypes.toString(),
		...dropzoneOptions,
	})

	return {
		...state,
		acceptedFileTypesExt,
	}
}

function useHandleOnDropAccepted(
	onDropAccepted?: (collection: FileCollection) => void,
) {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.add(files)
				onDropAccepted?.(fileCollection)
			} catch (e) {
				log('error in useHandleOnDropAccepted', e)
			}
		},
		[onDropAccepted],
	)
}

function useHandleOnDropRejected(
	acceptedFileTypes: string[],
	onDropRejected?: (message: string, files?: FileRejection[]) => void,
) {
	return useCallback(
		(files: FileRejection[]) => {
			const message = `File type must be: ${acceptedFileTypes.join(', ')}`
			onDropRejected?.(message, files)
		},
		[onDropRejected, acceptedFileTypes],
	)
}

function useHandleOnDrop(onDrop?: (collection: FileCollection) => void) {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.add(files)
				onDrop?.(fileCollection)
			} catch (e) {
				log('error in useHandleOnDrop', e)
			}
		},
		[onDrop],
	)
}
