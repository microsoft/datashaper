/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyInstruction } from '@datashaper/core'
import type { IDropdownOption } from '@fluentui/react'

export interface SortInstructionProps {
	columnOptions: IDropdownOption[]
	order: OrderbyInstruction
	onChange?: (order: OrderbyInstruction) => void
	onDelete?: () => void
}
