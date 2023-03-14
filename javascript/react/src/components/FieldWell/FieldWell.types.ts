/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	IDropdownStyles,
	IIconStyles,
	ISelectableOption,
} from '@fluentui/react'
import type { CSSProperties } from 'react'

/**
 * Defines an available field well.
 * This includes UX properties for how to visually represent it (title, icon, etc).
 * This implementation is rendered with a dropdown, and is in many ways just a fancy stylized dropdown.
 */
export interface FieldWellItem {
	/**
	 * Unique key for the well.
	 */
	key: string
	/**
	 * Title to display above the well.
	 */
	title: string
	/**
	 * Name of an icon to render in front of the well dropdown.
	 */
	icon?: string
	/**
	 * Placeholder for the dropdown when no value is selected.
	 */
	placeholder?: string
	/**
	 * Indicate if the well is required - this will render a red asterisk next to the title.
	 */
	required?: boolean
	/**
	 * List of valid options that this field well can be set to.
	 */
	options?: ISelectableOption[]
	/**
	 * Selected key for the dropdown.
	 */
	selectedKey?: string
	/**
	 * Change handler for the dropdown, presenting the new selected key.
	 * @param key
	 * @returns
	 */
	onChange?: (key: string) => void
	/**
	 * Handler to indicate that a field well has been reset to its default state (no binding).
	 * @returns
	 */
	onReset?: () => void
}

export interface FieldWellStyles {
	root?: CSSProperties
	title?: CSSProperties
	required?: CSSProperties
	well?: CSSProperties
	icon?: Partial<IIconStyles>
	dropdown?: Partial<IDropdownStyles>
}

/**
 * Props for the FieldWell component.
 */
export interface FieldWellProps extends FieldWellItem {
	styles?: FieldWellStyles
}
