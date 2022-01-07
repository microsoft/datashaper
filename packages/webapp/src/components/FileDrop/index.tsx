/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropzone } from '@data-wrangling-components/react'
import {
	FileCollection,
	FileMimeType,
} from '@data-wrangling-components/utilities'
import { memo, useMemo } from 'react'

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
	extensions = [FileMimeType.csv],
}) {
	const styles = useMemo(
		(): any => ({
			container: {
				height: '100%',
				width: '100%',
				margin: '0',
			},
			placeholder: {
				fontSize: '14px',
			},
			dragReject: {
				fontSize: '11px',
				width: '90%',
			},
		}),
		[],
	)
	const exts = useMemo(() => {
		return extensions
			.map(x =>
				x.toLowerCase().includes('application') ||
				x.toLowerCase().includes('text')
					? FileMimeType[x as keyof typeof FileMimeType]
					: x,
			)
			.join(', ')
	}, [extensions])
	return (
		<Dropzone
			placeholder={text || `Drop ${exts} files here`}
			onDrop={onDrop}
			acceptedFileTypes={extensions}
			styles={styles}
		/>
	)
})
