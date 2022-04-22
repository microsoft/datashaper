/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	FileCollection,
	FileMimeType,
} from '@data-wrangling-components/utilities'
import { useCallback } from 'react'
import type { DropzoneState as DzState } from 'react-dropzone'
import { useDropzone as UseDz } from 'react-dropzone'

import type { DzProps, FileRejection } from '../types.js'

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

const useHandleOnDropAccepted = (
	onDropAccepted?: (collection: FileCollection) => void,
) => {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.add(files)
				onDropAccepted?.(fileCollection)
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
			onDropRejected?.(message, files)
		},
		[onDropRejected, acceptedFileTypes],
	)
}

const useHandleOnDrop = (onDrop?: (collection: FileCollection) => void) => {
	return useCallback(
		async (files: FileWithPath[]) => {
			const fileCollection = new FileCollection()
			try {
				await fileCollection.add(files)
				onDrop?.(fileCollection)
			} catch (e) {
				console.error(e)
			}
		},
		[onDrop],
	)
}

export const useHandleOnUploadClick = (
	acceptedFileTypes: string[],
	handleCollection?: (fileCollection: FileCollection) => void,
): (() => void) => {
	return useCallback(() => {
		let input: HTMLInputElement | null = document.createElement('input')
		input.type = 'file'
		input.multiple = true
		input.accept = acceptedFileTypes.toString()
		input.onchange = async (e: any) => {
			if (e?.target?.files?.length) {
				const { files } = e.target
				const fileCollection = new FileCollection()
				try {
					await fileCollection.add(files[0])
					handleCollection?.(fileCollection)
				} catch (e) {
					console.error(e)
				}
			}
		}
		input.click()
		input = null
	}, [acceptedFileTypes, handleCollection])
}
