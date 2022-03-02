/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IButtonStyles } from '@fluentui/react'

export const dropdownStyles = {
	root: {
		// this matches the default fixed dropdown width for fluent menus
		width: 180,
		marginRight: 12,
	},
}

export const opDropdownStyles = {
	root: {
		width: 120,
		marginRight: 12,
	},
}

export const dropdownButtonStyles: IButtonStyles = {
	root: {
		width: 180,
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		fontWeight: 'normal',
	},
}
