/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { useDropzone } from './Dropzone.hooks.js'
import { DEFAULT_STYLES, staticStyles } from './Dropzone.styles.js'
import type { DropzoneProps } from './Dropzone.types.js'

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
		const theme = useTheme()
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
				borderColor: isDragActive
					? theme.palette.themePrimary
					: theme.palette.neutralTertiary,
				...styles.container,
			}),
			[styles, theme, isDragActive],
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
				backgroundColor: theme.palette.neutralPrimary,
				color: theme.palette.white,
				...styles.dragReject,
			}),
			[theme, styles],
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
