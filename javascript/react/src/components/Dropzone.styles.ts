/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DropzoneStyles } from './Dropzone.types.js'

export const staticStyles = {
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
	placeholder: {
		fontSize: '14px',
	} as React.CSSProperties,
}

export const DEFAULT_STYLES: DropzoneStyles = Object.freeze({
	container: {},
	dragReject: {},
	placeholder: {},
	dragZone: {},
})
