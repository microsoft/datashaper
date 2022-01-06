/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableStore, Step } from '@data-wrangling-components/core'
import { IDropdownOption } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import { set } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

const noop = (value: unknown) => value

/**
 * Make a basic set of string options from an array
 * @param list
 * @returns
 */
export function useSimpleOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name,
			})),
		[list],
	)
}

/**
 * Creates a list of dropdown options from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store
 * @returns
 */
export function useTableOptions(store: TableStore): IDropdownOption[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		store.addChangeListener(() => setDirty(true))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store.list())
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleOptions(list)
}

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table
 * @returns
 */
export function useTableColumnOptions(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): IDropdownOption[] {
	return useSimpleOptions(table?.columnNames(filter) || [])
}

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useHandleDropdownChange(
	step: Step,
	path: string,
	onChange?: (update: Step) => void,
): (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void {
	return useCallback(
		(event, option) => {
			const update = {
				...step,
			}
			set(update, path, option?.key)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useHandleTextfieldChange(
	step: Step,
	path: string,
	onChange?: (update: Step) => void,
	transformer = noop,
): (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void {
	return useCallback(
		(event, newValue) => {
			const update = {
				...step,
			}
			const value = transformer(newValue)
			set(update, path, value)
			onChange && onChange(update)
		},
		[step, path, onChange, transformer],
	)
}

export function useHandleCheckboxChange(
	step: Step,
	path: string,
	onChange?: (update: Step) => void,
): (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void {
	return useCallback(
		(event, checked) => {
			const update = {
				...step,
			}
			set(update, path, checked)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useLoadTable(
	name: string | undefined,
	store: TableStore,
	onLoad: (table: ColumnTable) => void,
): void {
	useEffect(() => {
		const fn = async (n: string) => {
			try {
				store.listen(n, onLoad)
				const t = await store.get(n)
				onLoad(t)
			} catch (e) {
				// swallow the error - we may try to request async before the table is registered
				// it'll get picked up later by the listener
				// TODO: should we only listen if it fails at first?
			}
		}
		if (name) {
			fn(name)
		}
		return () => {
			name && store.unlisten(name)
		}
	}, [name, store, onLoad])
}
