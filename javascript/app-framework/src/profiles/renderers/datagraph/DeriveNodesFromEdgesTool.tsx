/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useCallback, useMemo, useState } from 'react'
import type { Resource } from '@datashaper/workflow'
import { DataTableProfile, CodebookProfile, TableBundleProfile, DataGraph } from '@datashaper/workflow'
import { ToolboxRendererProps } from '../../toolbox/types.js'
import styled from 'styled-components'
import { KnownProfile } from '@datashaper/schema'
import { Dropdown, PrimaryButton, type IDropdownOption } from '@fluentui/react'
import { deriveNodesFromEdges, generateCodebook } from '@datashaper/tables'

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
		const [selectedGraph, setSelectedGraph] = useState<DataGraph | undefined>(undefined)
		const onTableChange = useCallback((_e: React.FormEvent<HTMLDivElement>, o?: IDropdownOption) => {
			setSelectedTable(tables.find((t) => t.name === o?.key))
		}, [tables])
		const onGraphChange = useCallback((_e: React.FormEvent<HTMLDivElement>, o?: IDropdownOption) => {
			setSelectedGraph(graphs.find((t) => t.name === o?.key) as DataGraph)
		}, [tables])
		const handleClick = useCallback(async () => {
			console.log('creating from table', selectedTable)
			console.log('into graph', selectedGraph)
			if (selectedTable) {

				const table = await (new DataTableProfile).createInstance?.({
					profile: KnownProfile.DataTable,
					name: 'new-nodes.csv',
				})
				const edges = (selectedTable as any).output.table
				const nodes = deriveNodesFromEdges(edges, 'source', 'target', 'id', true)
				table.data = new Blob([nodes.toCSV()])

				const codebook = await (new CodebookProfile).createInstance?.(await generateCodebook(nodes))

				// link it directly to a graph if one is selected
				// otherwise, the user can manually bind it
				if (selectedGraph) {
					selectedGraph.sources = [table, ...selectedGraph.sources]
					selectedGraph.nodes.input = table.name
					selectedGraph.nodes.bindings.x.field = 'x'
					selectedGraph.nodes.bindings.y.field = 'y'
				}
												
				const bundle = await (new TableBundleProfile).createInstance?.({
					profile: KnownProfile.TableBundle,
					name: 'New Nodes'
				})

				bundle.sources = [table, codebook]
				onResourceCreated?.(bundle)
			}
		}, [selectedTable, selectedGraph, onResourceCreated])
		return <Container>
			<Dropdown
				required
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

