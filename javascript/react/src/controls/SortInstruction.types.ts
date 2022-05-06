import type { OrderbyInstruction } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'

export interface SortInstructionProps {
	columnOptions: IDropdownOption[]
	order: OrderbyInstruction
	onChange?: (order: OrderbyInstruction) => void
	onDelete?: () => void
}
