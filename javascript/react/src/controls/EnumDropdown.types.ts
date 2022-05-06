import type { IDropdownProps } from '@fluentui/react'

export interface EnumDropdownProps<E = unknown>
	extends Omit<IDropdownProps, 'options'> {
	enumeration: E
	/**
	 * Optional labels to map enum keys to alternet text
	 */
	labels?: Record<string, string>
}
