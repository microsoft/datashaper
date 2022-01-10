/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	FileMimeType,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { useCallback } from 'react'
import { useDropzone as UseDz, DropzoneState as DzState } from 'react-dropzone'
import { DzProps, FileRejection } from '../types'

export interface DropzoneState extends DzState {
	acceptedFileTypesExt: string[]
}

export const useDropzone: (props: DzProps) => DropzoneState = ({
	acceptedFileTypes,
	onDrop,
	onDropRejected,
	onDropAccepted,
	dropzoneOptions,
}: DzProps) => {
	const handleOnDrop = useHandleOnDrop(onDrop)
	const handleOnDropAccepted = useHandleOnDropAccepted(onDropAccepted)
	const acceptedFileTypesExt = acceptedFileTypes.map(x =>
		x.toLowerCase().includes('application') || x.toLowerCase().includes('text')
			? FileMimeType[x as keyof typeof FileMimeType]
			: x,
	)
	const handleOnDropRejected = useHandleOnDropRejected(
		acceptedFileTypesExt,
		onDropRejected,
	)
	const state = UseDz({
		onDrop: (files: File[]) => handleOnDrop(files as FileWithPath[]),
		onDropAccepted: (files: File[]) =>
			handleOnDropAccepted(files as FileWithPath[]),
		onDropRejected: handleOnDropRejected,
		accept: acceptedFileTypes.toString(),
		...dropzoneOptions,
	})

	return {
		...state,
		acceptedFileTypesExt,
	}
}

const useHandleOnDropAccepted = (
	onDropAccepted?: (collection: FileCollection) => void,
) => {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.init(files)
				onDropAccepted && onDropAccepted(fileCollection)
			} catch (e) {
				console.error(e)
			}
		},
		[onDropAccepted],
	)
}

const useHandleOnDropRejected = (
	acceptedFileTypes: string[],
	onDropRejected?: (message: string, files?: FileRejection[]) => void,
) => {
	return useCallback(
		(files: FileRejection[]) => {
			const message = `File type must be: ${acceptedFileTypes.join(', ')}`
			onDropRejected && onDropRejected(message, files)
		},
		[onDropRejected, acceptedFileTypes],
	)
}

const useHandleOnDrop = (onDrop?: (collection: FileCollection) => void) => {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.init(files)
				onDrop && onDrop(fileCollection)
			} catch (e) {
				console.error(e)
			}
		},
		[onDrop],
	)
}
