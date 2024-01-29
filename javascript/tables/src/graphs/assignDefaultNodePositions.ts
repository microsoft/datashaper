import { op } from "arquero";
import ColumnTable from "arquero/dist/types/table/column-table.js";

export enum Positioner {
    Grid = 'grid',
    Random = 'random'
}
/**
 * Assigns a default position to each node in a table to ensure that it is plottable.
 * Note that this is NOT a layout algorithm.
 * @param nodes 
 * @param x 
 * @param y
 */
export function assignDefaultNodePositions(nodes: ColumnTable, x = 'x', y = 'y', positioner = Positioner.Grid): ColumnTable {

    if (positioner === Positioner.Random) {
        return nodes.derive({
            [x]: () => Math.random(),
            [y]: () => Math.random()
        })
    } else {
        const ranked = nodes
			.params({
				rows: nodes.numRows(),
				root: Math.sqrt(nodes.numRows()),
			})
			.derive({
				row: op.row_number(),
			})
			.derive({
				[x]: (d: any, $: any) => {
					const r = Math.floor(d.row / $.root)
					const col = d.row - r * $.root
					return (1 / $.root) * col
				},
                [y]: (d: any, $: any) => {
					const r = Math.floor(d.row / $.root)
					const baseY = (1 / $.root) * r
					return 1 - baseY - 1 / $.root
				},
			})
        const normalized = normalizeXY(ranked)
        return normalized
		
    }
}

function normalizeXY(table: ColumnTable, x = 'x', y = 'y') {
	const bounds = table.rollup({
		xMin: op.min(x),
		xMax: op.max(x),
		yMin: op.min(y),
		yMax: op.max(y),
	})
	const xRange = bounds.get('xMax', 0) + Math.abs(bounds.get('xMin', 0))
	const yRange = bounds.get('yMax', 0) + Math.abs(bounds.get('yMin', 0))
	const aspect = xRange / yRange
	return table
		.params({
            x,
            y,
			xMin: Math.abs(bounds.get('xMin', 0)),
			xRange,
			yMin: Math.abs(bounds.get('yMin', 0)),
			yRange,
			aspect,
		})
		.derive({
			[x]: (d: any, $: any) =>
				((d[$.x] + $.xMin) / $.xRange) * $.aspect,
			[y]: (d: any, $: any) => (d[$.y] + $.yMin) / $.yRange,
		})
}