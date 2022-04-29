/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import { useEffect, useState } from 'react'

/**
 * Creates a list of table-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store -
 * @returns
 */
export function useTableNames(store?: TableStore): string[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		return store?.onChange(() => setTimeout(() => setDirty(true), 0))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list().sort() || [])
		}
	}, [store, dirty, setDirty, setList])
	return list
}
