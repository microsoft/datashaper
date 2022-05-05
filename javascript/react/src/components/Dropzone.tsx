/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'

import { useDropzone } from './Dropzone.hooks.js'
import type { DropzoneProps } from './Dropzone.types.js'
import { DEFAULT_STYLES, staticStyles } from './Dropzone.styles.js'

const DEFAULT_ACCEPTED_FILE_TYPES: string[] = []
const DEFAULT_DROPZONE_OPTIONS: DropzoneProps['dropzoneOptions'] = {}

export const Dropzone: React.FC<React.PropsWithChildren<DropzoneProps>> = memo(
	function Dropzone({
		onDrop,
		onDropRejected,
		onDropAccepted,
		acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
		dropzoneOptions = DEFAULT_DROPZONE_OPTIONS,
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
				...staticStyles.placeholder,
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
