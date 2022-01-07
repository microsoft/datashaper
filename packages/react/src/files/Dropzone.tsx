/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileCollection } from '@data-wrangling-components/utilities'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
import type { FileRejection, DropzoneOptions } from 'react-dropzone'
import { useFileManagementDropzone } from './hooks'

interface DropzoneProps {
	onDrop?: (fileCollection: FileCollection) => void
	onRejected?: (message: string, files?: FileRejection[]) => void
	dropzoneProps?: Omit<DropzoneOptions, 'onDrop' | 'onDropRejected'>
	acceptedFileTypes?: string[]
	placeholder?: string
	styles?: {
		container?: React.CSSProperties
		dragReject?: React.CSSProperties
		placeholder?: React.CSSProperties
		dragZone?: React.CSSProperties
	}
	disabled?: boolean
}
export const Dropzone: React.FC<DropzoneProps> = memo(function Dropzone({
	placeholder = `Drag 'n' drop some files here, or click to select files`,
	styles = {
		container: {},
		dragReject: {},
		placeholder: {},
		dragZone: {},
	},
	acceptedFileTypes = [],
	onDrop,
	onRejected,
	dropzoneProps = {},
}) {
	const thematic = useThematic()
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		acceptedFileTypesExt,
	} = useFileManagementDropzone({
		acceptedFileTypes,
		onDropRejected: onRejected,
		onDrop,
		...dropzoneProps,
	})
	const container: React.CSSProperties = useMemo(
		() => ({
			border:
				'1px dashed ' +
				(isDragActive
					? thematic.application().accent().hex()
					: thematic.application().lowContrast().hex()),
			borderRadius: '5px',
			width: '250px',
			height: '250px',
			margin: '1rem auto',
			cursor: 'pointer',
			opacity: isDragActive ? 0.5 : 1,
			fontSize: '1.5rem',
			...styles.container,
		}),
		[styles, thematic, isDragActive],
	)
	const dragZone: React.CSSProperties = useMemo(
		() => ({
			position: 'relative',
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...styles.dragZone,
		}),
		[styles],
	)
	const dragReject: React.CSSProperties = useMemo(
		() => ({
			position: 'absolute',
			width: '100%',
			height: '100%',
			backgroundColor: thematic.application().foreground().hex(),
			color: thematic.application().background().hex(),
			opacity: 0.5,
			padding: '5px',
			borderRadius: '5px',
			textAlign: 'center',
			fontSize: '1.3rem',
			...styles.dragReject,
		}),
		[thematic, styles],
	)
	const placeholderStyles: React.CSSProperties = useMemo(
		() => ({
			...styles.placeholder,
		}),
		[styles],
	)
	return (
		<section style={container}>
			<div style={dragZone} {...getRootProps()}>
				<input {...getInputProps()} />
				{acceptedFileTypes.some(
					t => t.includes('application') || t.includes('text'),
				) && isDragReject ? (
					<div style={dragReject}>
						<p style={{ margin: 0 }}>Some files will be rejected.</p>
						<small>
							The accepted file types are: {acceptedFileTypesExt.join(', ')}
						</small>
					</div>
				) : (
					<p style={placeholderStyles}>{placeholder}</p>
				)}
			</div>
		</section>
	)
})
