/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSVFormatOptions } from 'arquero/dist/types/format/to-csv'
import type ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Downloads a csv copy of a table
 * @param table
 * @param filename
 */
export function download(
	table: ColumnTable,
	filename = 'download.csv',
	options?: CSVFormatOptions,
): void {
	const blob = new Blob([table.toCSV(options)])
	const dataURI = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = dataURI
	link.type = 'text/csv'
	link.download = filename
	link.click()
}
