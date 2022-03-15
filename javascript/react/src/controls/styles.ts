/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IButtonStyles } from '@fluentui/react'

/**
 * For side-by-side dropdowns with a 12px gap
 */
export const narrowDropdownStyles = {
	root: {
		width: 135,
	},
}

export const dropdownStyles = {
	root: {
		width: 220,
	},
}

export const opDropdownStyles = {
	root: {
		width: 220,
	},
}

export const dropdownButtonStyles: IButtonStyles = {
	root: {
		width: 220,
		// match the dropdowns for better visual alignment
		paddingLeft: 4,
		paddingRight: 4,
		textAlign: 'left',
	},
	label: {
		fontWeight: 'normal',
	},
}
