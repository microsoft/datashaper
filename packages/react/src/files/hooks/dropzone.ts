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
import {
	useDropzone as UseDz,
	FileRejection,
	DropzoneOptions,
	DropzoneState as DzState,
} from 'react-dropzone'

interface DropzoneProps {
	acceptedFileTypes: string[]
	onDrop?: (collection: FileCollection) => void
	onDropRejected?: (message: string, files?: FileRejection[]) => void
	dropzoneOptions?: Omit<DropzoneOptions, 'onDrop' | 'onDropRejected'>
}

interface DropzoneState extends DzState {
	acceptedFileTypesExt: string[]
}

export const useDropzone: (props: DropzoneProps) => DropzoneState = ({
	acceptedFileTypes,
	onDrop,
	onDropRejected,
	dropzoneOptions,
}: DropzoneProps) => {
	const handleOnDrop = useHandleOnDrop(onDrop)
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
		onDrop: async (files: File[]) =>
			await handleOnDrop(files as FileWithPath[]),
		onDropRejected: (files: FileRejection[]) => handleOnDropRejected(files),
		accept: acceptedFileTypes.toString(),
		...dropzoneOptions,
	})

	return {
		...state,
		acceptedFileTypesExt,
	}
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
