/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification, TableStore } from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'

const TABLES = [
	`data/companies.csv`,
	`data/companies2.csv`,
	`data/products.csv`,
	'data/stocks.csv',
]

const identity = (d: any) => d

// default parsers to keep these columns as strings
const parse = {
	ID: identity,
	Group: identity,
}

export function useInputTableList(): [
	string[],
	React.Dispatch<React.SetStateAction<string[]>>,
] {
	return useState<string[]>(TABLES)
}

// create the store and initialize it with our test tables
// memoing this gives us a chance queue up our built-in test tables on first run
export function useTableStore(): TableStore {
	return useMemo(() => {
		const store = new TableStore()
		TABLES.forEach(name => {
			store.queue(name, async name => loadCSV(name, { parse }))
		})
		return store
	}, [])
}

// write out the loaded test tables to a map for rendering
export function useInputTables(
	list: string[],
	store: TableStore,
): Map<string, ColumnTable> {
	const [tables, setTables] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	useEffect(() => {
		const f = async () => {
			const results = await store.toMap()
			setTables(results)
		}
		f()
	}, [list, store, setTables])
	return tables
}

export function useLoadTableFiles(): (
	files: BaseFile[],
) => Promise<Map<string, ColumnTable>> {
	return useCallback(
		async (files: BaseFile[]): Promise<Map<string, ColumnTable>> => {
			const list = await Promise.all(files.map(readTable))
			return list.reduce((acc, cur) => {
				acc.set(cur[0], cur[1])
				return acc
			}, new Map<string, ColumnTable>())
		},
		[],
	)
}

export function useLoadSpecFile(): (file: BaseFile) => Promise<Specification> {
	return useCallback(async (file: BaseFile): Promise<Specification> => {
		return file.toJson()
	}, [])
}

async function readTable(file: BaseFile): Promise<[string, ColumnTable]> {
	const table = await file.toTable()
	return [file.name, table]
}
