/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, IDropdownProps } from '@fluentui/react'

export interface TableColumnDropdownProps extends Partial<IDropdownProps> {
	options: IDropdownOption[]
}
