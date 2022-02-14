/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
import { useDropzone } from './hooks'
import type { DzProps } from './types'

interface DropzoneProps extends DzProps {
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
	onDrop,
	onDropRejected,
	onDropAccepted,
	acceptedFileTypes = [],
	dropzoneOptions = {},
	placeholder,
	styles = {
		container: {},
		dragReject: {},
		placeholder: {},
		dragZone: {},
	},
	children,
}) {
	const thematic = useThematic()
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		acceptedFileTypesExt,
	} = useDropzone({
		acceptedFileTypes,
		onDropRejected,
		onDropAccepted,
		onDrop,
		dropzoneOptions,
	})
	const placeholderText = useMemo((): string => {
		return placeholder || `Drop ${acceptedFileTypesExt} files here`
	}, [placeholder, acceptedFileTypesExt])
	const container: React.CSSProperties = useMemo(
		() => ({
			border:
				'1px dashed ' +
				(isDragActive
					? thematic.application().accent().hex()
					: thematic.application().lowContrast().hex()),
			borderRadius: '5px',
			width: '100%',
			height: '100%',
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
			width: '90%',
			height: '90%',
			backgroundColor: thematic.application().foreground().hex(),
			color: thematic.application().background().hex(),
			opacity: 0.5,
			padding: '5px',
			borderRadius: '5px',
			textAlign: 'center',
			fontSize: '12px',
			...styles.dragReject,
		}),
		[thematic, styles],
	)
	const placeholderStyles: React.CSSProperties = useMemo(
		() => ({
			fontSize: '14px',
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
					children || <p style={placeholderStyles}>{placeholderText}</p>
				)}
			</div>
		</section>
	)
})
