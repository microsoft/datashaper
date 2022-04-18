/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	SpecificationInput,
	TableStore,
} from '@data-wrangling-components/core'
import { createTableStore } from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
import { container } from '@essex/arquero'
import { loadCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { from } from 'rxjs'

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
export function useTableStore(autoType = false): TableStore {
	return useMemo(() => {
		const store = createTableStore()
		TABLES.forEach(name => {
			const tablePromise = loadCSV(name, {
				parse,
				autoMax: 100000,
				autoType,
			}).then(res => container(name, res))
			store.set(name, from(tablePromise))
		})
		return store
	}, [autoType])
}

// write out the loaded test tables to a map for rendering
export function useInputTables(
	list: string[],
	store: TableStore,
): Map<string, TableContainer> {
	const [tables, setTables] = useState<Map<string, TableContainer>>(
		new Map<string, TableContainer>(),
	)
	useEffect(() => {
		const results = store.toMap()
		setTables(results)
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

export function useLoadSpecFile(): (
	file: BaseFile,
) => Promise<SpecificationInput> {
	return useCallback((file: BaseFile): Promise<SpecificationInput> => {
		return file.toJson() as any
	}, [])
}

async function readTable(file: BaseFile): Promise<[string, ColumnTable]> {
	const table = await file.toTable()
	return [file.name, table]
}
