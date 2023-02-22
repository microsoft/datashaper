/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'

/**
 * Defines an available field well.
 * This includes UX properties for how to visually represent it (title, icon, etc).
 * This implementation is rendered as a dropdown.
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
	options?: IDropdownOption[]
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
}

/**
 * Props for the FieldWell component.
 */
export interface FieldWellProps {
	field: FieldWellItem
}
