/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@datashaper/arquero'
import type { OrderbyInstruction } from '@datashaper/core'
import type { IDropdownOption } from '@fluentui/react'
import { useCallback } from 'react'

export function useHandleColumnChange(
	order: OrderbyInstruction,
	onChange: ((order: OrderbyInstruction) => void) | undefined,
): (e: any, option: IDropdownOption | undefined) => void {
	return useCallback(
		(_e: any, opt: IDropdownOption | undefined) => {
			const update = {
				...order,
				column: opt?.key as string,
			}
			onChange?.(update)
		},
		[order, onChange],
	)
}

export function useHandleDirectionClick(
	order: OrderbyInstruction,
	onChange: ((order: OrderbyInstruction) => void) | undefined,
): () => void {
	return useCallback(() => {
		const update = {
			...order,
			direction:
				order.direction === SortDirection.Descending
					? SortDirection.Ascending
					: SortDirection.Descending,
		}
		onChange?.(update)
	}, [order, onChange])
}
