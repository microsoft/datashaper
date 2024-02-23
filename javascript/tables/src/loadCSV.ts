import { CSVParseOptions } from "arquero/dist/types/format/from-csv.js";
import ColumnTable from "arquero/dist/types/table/column-table.js";
import { fromCSV } from "./fromCSV.js";

/**
 * Drop-in replacement for arquero loadCSV, using our internal parsing with auto-typing turned on.
 * Meant for quick-and-dirty reads, with the advantage that our default parsing aligns with pandas.
 * Use readTable for more control over schema options and formats.
 */
export async function loadCSV(url: string, options: CSVParseOptions): Promise<ColumnTable> {
    return fetch(url).then(r => r.text()).then(text => fromCSV(text, options))	
}