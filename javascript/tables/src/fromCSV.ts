import { CodebookStrategy } from '@datashaper/schema'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv.js'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { applyCodebook } from './applyCodebook.js'
import { generateCodebook } from './generateCodebook.js'
import { readCsvTable } from './readCsvTable.js'

/**
 * Drop-in replacement for arquero fromCSV, using our internal parsing with auto-typing turned on.
 * Meant for quick-and-dirty reads, with the advantage that our default parsing aligns with pandas.
 * Use readTable for more control over schema options and formats.
 */
export function fromCSV(
	text: string,
	options: CSVParseOptions = {
		autoType: true,
		autoMax: Infinity,
	},
): ColumnTable {
	const { autoType, autoMax, ...rest } = options

	const csv = readCsvTable(text, {
		parser: rest,
	})
	if (options?.autoType) {
		const codebook = generateCodebook(csv, options)
		return applyCodebook(csv, codebook, CodebookStrategy.DataTypeOnly)
	}
	return csv
}
