/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CartesianLineBindings,
	CartesianPointBindings,
} from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo } from 'react'

import '@react-sigma/core/lib/react-sigma.min.css'

import { useGraph } from './GraphViewer.hooks.js'
import { useSigmaStyles } from './GraphViewer.styles.js'
import { SigmaContainer } from '@react-sigma/core'

export interface GraphViewerProps {
	nodesTable: ColumnTable
	edgesTable: ColumnTable
	nodeBindings: CartesianPointBindings
	edgeBindings: CartesianLineBindings
	showEdges?: boolean
}

export const GraphViewer: React.FC<GraphViewerProps> = memo(
	function GraphViewer({
		nodesTable,
		edgesTable,
		nodeBindings,
		edgeBindings,
		showEdges = false,
	}) {
		const sigmaStyles = useSigmaStyles()
		const graph = useGraph(
			nodesTable,
			edgesTable,
			nodeBindings,
			edgeBindings,
			showEdges,
		)
		return <SigmaContainer graph={graph} style={sigmaStyles} />
	},
)
