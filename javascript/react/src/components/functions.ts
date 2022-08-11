/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSVFormatOptions } from 'arquero/dist/types/format/to-csv'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function noop(): void {
	/* do-nothing */
}

/**
 * Downloads a csv copy of a table
 * @param table -
 * @param filename -
 */
export function downloadTable(
	table: ColumnTable,
	filename = 'download.csv',
	options?: CSVFormatOptions,
): void {
	const blob = new Blob([table.toCSV(options)])
	download(filename, 'text/csv', blob)
}

function download(filename: string, type: string, data: Blob): void {
	const dataURI = URL.createObjectURL(data)
	const link = document.createElement('a')
	link.href = dataURI
	link.type = type
	link.download = filename
	link.click()
}
