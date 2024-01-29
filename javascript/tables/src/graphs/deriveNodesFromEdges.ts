import ColumnTable from "arquero/dist/types/table/column-table.js";
import { assignDefaultNodePositions } from "./assignDefaultNodePositions.js";

/**
 * Derives a table of unique nodes from an edge list
 * @param edges 
 * @param source 
 * @param target
 * @param nodeId
 */
export function deriveNodesFromEdges(edges: ColumnTable, source: string, target: string, nodeId = 'id', defaultPositions = false): ColumnTable {

    if (!edges.column(source)) {
        throw new Error(`Invalid source column: ${source}`)
    }
    if (!edges.column(target)) {
        throw new Error(`Invalid target column: ${target}`)
    }
    const nodes = edges
        .fold([source, target])
        // TODO: it is possible this will exist already
        .dedupe('value')
        .ungroup()
        .select({ value: nodeId })
    if (defaultPositions) {
        return assignDefaultNodePositions(nodes, 'x', 'y')
    }
    return nodes
}