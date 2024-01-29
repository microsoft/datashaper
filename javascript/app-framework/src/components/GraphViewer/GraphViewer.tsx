/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataGraphEdges, DataGraphNodes } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo } from 'react'
import '@react-sigma/core/lib/react-sigma.min.css'

import { useGraph } from './GraphViewer.hooks.js'
import { useSigmaStyles } from './GraphViewer.styles.js'
import { SigmaContainer } from '@react-sigma/core'

export interface GraphViewerProps {
	nodesTable: ColumnTable
	edgesTable: ColumnTable
	nodesDefinition: DataGraphNodes
	edgesDefinition: DataGraphEdges
	edgeProportion?: number
}

export const GraphViewer: React.FC<GraphViewerProps> = memo(
	function GraphViewer({
		nodesTable,
		edgesTable,
		nodesDefinition,
		edgesDefinition,
		edgeProportion = 0,
	}) {
		const sigmaStyles = useSigmaStyles()
		const graph = useGraph(
			nodesTable,
			edgesTable,
			nodesDefinition,
			edgesDefinition,
			edgeProportion,
		)
		return <SigmaContainer graph={graph} style={sigmaStyles} />
	},
)
