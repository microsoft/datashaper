/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DropzoneStyles } from './Dropzone.types.js'

export const staticStyles = {
	container: {
		borderWidth: '1px',
		width: '100%',
		height: '100%',
		margin: 0,
		fontSize: '1.5rem',
	} as React.CSSProperties,
	dragZone: {
		position: 'relative',
		background: 'none',
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	} as React.CSSProperties,
	dragReject: {
		position: 'absolute',
		background: 'none',
		width: '90%',
		height: '90%',
		opacity: 0.5,
		padding: '5px',
		textAlign: 'left',
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
