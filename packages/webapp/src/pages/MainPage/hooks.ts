/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Specification,
	TableStore,
	Pipeline,
} from '@data-wrangling-components/core'
import { fromCSV, loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const TABLES = [
	`data/companies.csv`,
	`data/companies2.csv`,
	`data/products.csv`,
	'data/stocks.csv',
	'data/large.csv',
]

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
			store.queue(name, async name => loadCSV(name, {}))
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

export function usePipeline(store: TableStore): Pipeline {
	return useMemo(() => new Pipeline(store), [store])
}

export function useLoadTableFiles(): (
	files: File[],
) => Promise<Map<string, ColumnTable>> {
	return useCallback(
		async (files: File[]): Promise<Map<string, ColumnTable>> => {
			const list = await Promise.all(files.map(readTable))
			return list.reduce((acc, cur) => {
				acc.set(cur[0], cur[1])
				return acc
			}, new Map<string, ColumnTable>())
		},
		[],
	)
}

export function useLoadSpecFile(): (file: File) => Promise<Specification> {
	return useCallback(async (file: File): Promise<Specification> => {
		return readSpec(file)
	}, [])
}

async function readSpec(file: File): Promise<Specification> {
	return new Promise((resolve, reject) => {
		const reader = createReader()
		reader.onload = () => {
			try {
				const text = reader.result ? reader.result.toString() : ''
				const spec = JSON.parse(text) as Specification
				resolve(spec)
			} catch (e) {
				reject(e)
			}
		}
		reader.readAsBinaryString(file)
	})
}

async function readTable(file: File): Promise<[string, ColumnTable]> {
	return new Promise((resolve, reject) => {
		const reader = createReader()
		reader.onload = () => {
			try {
				const text = reader.result ? reader.result.toString() : ''
				const table = fromCSV(text)
				resolve([file.name, table])
			} catch (e) {
				reject(e)
			}
		}
		reader.readAsBinaryString(file)
	})
}

function createReader() {
	const reader = new FileReader()
	reader.onabort = () => console.log('file reading was aborted')
	reader.onerror = () => console.log('file reading has failed')
	return reader
}
