/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { useDropzone } from './Dropzone.hooks.js'
import type { DropzoneStyles, DropzoneProps } from './types.js'

const DEFAULT_STYLES: DropzoneStyles = Object.freeze({
	container: {},
	dragReject: {},
	placeholder: {},
	dragZone: {},
})

export const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = memo(
	function Dropzone({
		onDrop,
		onDropRejected,
		onDropAccepted,
		acceptedFileTypes = [],
		dropzoneOptions = {},
		placeholder,
		showPlaceholder = true,
		styles = DEFAULT_STYLES,
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
			return showPlaceholder
				? placeholder || `Drop ${acceptedFileTypesExt} files here`
				: ''
		}, [showPlaceholder, placeholder, acceptedFileTypesExt])
		const container: React.CSSProperties = useMemo(
			() => ({
				...staticStyles.container,
				opacity: isDragActive ? 0.5 : 1,
				backgroundColor: isDragActive ? 'white' : 'transparent',
				borderColor: isDragActive
					? thematic.application().accent().hex()
					: thematic.application().lowContrast().hex(),
				...styles.container,
			}),
			[styles, thematic, isDragActive],
		)
		const dragZone: React.CSSProperties = useMemo(
			() => ({
				...staticStyles.dragZone,
				...styles.dragZone,
			}),
			[styles],
		)
		const dragReject: React.CSSProperties = useMemo(
			() => ({
				...staticStyles.dragReject,
				backgroundColor: thematic.application().foreground().hex(),
				color: thematic.application().background().hex(),
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
	},
)

const staticStyles = {
	container: {
		borderWidth: '1px',
		borderStyle: 'dashed',
		borderRadius: '5px',
		width: '100%',
		height: '100%',
		margin: '1rem auto',
		cursor: 'pointer',
		fontSize: '1.5rem',
	} as React.CSSProperties,
	dragZone: {
		position: 'relative',
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	} as React.CSSProperties,
	dragReject: {
		position: 'absolute',
		width: '90%',
		height: '90%',
		opacity: 0.5,
		padding: '5px',
		borderRadius: '5px',
		textAlign: 'center',
		fontSize: '12px',
	} as React.CSSProperties,
}
