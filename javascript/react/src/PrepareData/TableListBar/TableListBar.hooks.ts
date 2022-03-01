/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import {
	BaseButton,
	Button,
	IDropdownOption,
	SelectableOptionMenuItemType,
} from '@fluentui/react'
import { useCallback, useMemo } from 'react'

/**
 * Provides options and a change handler for selecting an input or derived table.
 * @param inputs
 * @param derived
 * @param onSelect
 * @returns
 */
export function useTableSelection(
	inputs: TableContainer[],
	derived: TableContainer[],
	onSelect?: (name: string) => void,
): {
	options: IDropdownOption[]
	onChange: (
		event: React.FormEvent<HTMLDivElement>,
		option?: IDropdownOption,
		index?: number,
	) => void
} {
	const options = useTableOptions(inputs, derived)

	const onChange = useCallback(
		(_evt, opt) => {
			onSelect && onSelect(opt.key)
		},
		[onSelect],
	)
	return {
		options,
		onChange,
	}
}

/**
 * Provides a button click handler to select the last derived table.
 * @param derived
 * @param onSelect
 * @returns
 */
export function useOutputPreview(
	derived: TableContainer[],
	onSelect?: (name: string) => void,
): {
	onClick:
		| React.MouseEventHandler<
				| HTMLDivElement
				| HTMLAnchorElement
				| HTMLButtonElement
				| BaseButton
				| Button
				| HTMLSpanElement
		  >
		| undefined
} {
	const lastId = useMemo(() => {
		if (derived && derived.length > 0) {
			return derived[derived.length - 1]!.id
		}
	}, [derived])

	const onClick = useCallback(() => {
		lastId && onSelect && onSelect(lastId)
	}, [lastId, onSelect])

	return {
		onClick,
	}
}

function useTableOptions(
	inputs: TableContainer[],
	derived: TableContainer[],
): IDropdownOption[] {
	const sortedInput = useMemo(
		() =>
			[...inputs].sort((a, b) =>
				(a.name || a.id).localeCompare(b.name || b.id),
			),
		[inputs],
	)
	const inputOptions = useOptions(sortedInput)
	const derivedOptions = useOptions(derived)
	return useMemo(
		() => [
			{
				key: '__input-header__',
				text: 'Inputs',
				itemType: SelectableOptionMenuItemType.Header,
			} as IDropdownOption,
			...inputOptions,
			{
				key: '__derived-header__',
				text: 'Derived',
				itemType: SelectableOptionMenuItemType.Header,
			} as IDropdownOption,
			...derivedOptions,
		],
		[inputOptions, derivedOptions],
	)
}

function useOptions(tables: TableContainer[]): IDropdownOption[] {
	return useMemo(() => {
		return tables.map(table => ({
			key: table.id,
			text: table.name || table.id,
		}))
	}, [tables])
}
