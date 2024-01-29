/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useCallback, useMemo, useState } from 'react'
import type { Resource } from '@datashaper/workflow'
import { DataTableProfile } from '@datashaper/workflow'
import { ToolboxRendererProps } from '../../toolbox/types.js'
import styled from 'styled-components'
import { KnownProfile } from '@datashaper/schema'
import { Dropdown, PrimaryButton } from '@fluentui/react'
import { deriveNodesFromEdges } from '@datashaper/tables'

export const DeriveNodesFromEdges: React.FC<ToolboxRendererProps> = memo(
	function DeriveNodesFromEdges({	
        resources,
		onResourceCreated	
	}) {
        console.log('toolbox resources', resources)
		const tables = useTables(resources)
		const graphs = useGraphs(resources)
		const tableOptions = useOptions(tables)
		const graphOptions = useOptions(graphs)
		const [selectedTable, setSelectedTable] = useState<Resource | undefined>(undefined)
		const [selectedGraph, setSelectedGraph] = useState<Resource | undefined>(undefined)
		const onTableChange = useCallback((e, o) => {
			setSelectedTable(tables.find((t) => t.name === o.key))
		}, [tables])
		const onGraphChange = useCallback((e, o) => {
			setSelectedGraph(graphs.find((t) => t.name === o.key))
		}, [tables])
		const handleClick = useCallback(() => {
			console.log('creating from table', selectedTable)
			console.log('into graph', selectedGraph)
			if (selectedTable && selectedGraph) {
				(new DataTableProfile).createInstance?.({
					name: 'new nodes'
				}).then((instance) => {
					console.log('created instance', instance)
					const edges = (selectedTable as any).output.table
					console.log(edges)
					const nodes = deriveNodesFromEdges(edges, 'source', 'target', 'id', true)
					nodes.print()
					instance.data = new Blob([nodes.toCSV()])
					selectedGraph.sources = [instance, ...selectedGraph.sources]
					selectedGraph.nodes.input = instance.name
					selectedGraph.identifier = 'id'
					selectedGraph.nodes.bindings.x.field = 'x'
					selectedGraph.nodes.bindings.y.field = 'y'
					console.log('selecgtedr', selectedGraph)
				})
			}
		}, [selectedTable, selectedGraph])
		return <Container>
			<Dropdown
				label={'Source table'}
				options={tableOptions}
				onChange={onTableChange}
			/>
			<Dropdown
				label={'Add to graph'}
				options={graphOptions}
				onChange={onGraphChange}
			/>
			<PrimaryButton onClick={handleClick}>Ok</PrimaryButton>
		</Container>
	},
)

export const Container = styled.div``

function useTables(resources: Resource[]) {
	return useMemo(() => resources.filter((r) => r.profile === KnownProfile.TableBundle || r.profile === KnownProfile.DataTable), [])
}

function useGraphs(resources: Resource[]) {
	return useMemo(() => resources.filter((r) => r.profile === KnownProfile.DataGraph), [])
}

function useOptions(resources: Resource[]) {
	return useMemo(() => resources.map((r) => ({ key: r.name, text: r.title || r.name })), [resources])
}

