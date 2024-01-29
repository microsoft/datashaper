/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { DataGraph, DataPackage } from '@datashaper/workflow'
import { DataGraphProfile, ResourceReference } from '@datashaper/workflow'

import type { AppProfile, AppProfileInitializationContext } from '../types.js'
import { CommandBarSection, ResourceGroupType } from '../types.js'
import { profileIcons } from './icons.js'
import { DataGraphRenderer } from './renderers/DataGraphRenderer.js'
import type { IContextualMenuItem } from '@fluentui/react'
import { KnownRel, createDataGraphSchemaObject } from '@datashaper/schema'
import { DeriveNodesFromEdges } from './renderers/datagraph/DeriveNodesFromEdgesTool.js'

export class DataGraphAppProfile
	extends DataGraphProfile
	implements AppProfile<DataGraph>
{
	public readonly title = 'Graph'
	public readonly renderer = DataGraphRenderer
	public readonly iconName = profileIcons.datagraph
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: AppProfileInitializationContext): void {
		this._dataPackage = dataPackage
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}

		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						const schema = createDataGraphSchemaObject({} as any) // TODO: fix typing
						this.createInstance(schema).then((resource) => {
							resource.name = dp.suggestResourceName(resource.name)
							dp.addResource(resource)
						})
					},
				},
			]
		}
	}

	public getMenuItems(resource: DataGraph): IContextualMenuItem[] {
		const dp = this._dataPackage
		if (!dp) {
			throw new Error('Data package not initialized')
		}

		const result: IContextualMenuItem[] = []
		// TODO: these could actually exist even if inputs are mapped, which would trigger a replacement
		if (resource.nodesInput == null) {
			result.push({
				key: 'add-nodes',
				text: 'Link nodes table',
				iconProps: { iconName: profileIcons.tablebundle },
				subMenuProps: {
					items: dp.resources
						.filter((r) => r.profile === 'tablebundle')
						.map((r) => ({
							key: r.name,
							text: r.name,
							onClick: () => {
								const reference = new ResourceReference()
								reference.target = r
								reference.rel = KnownRel.Input
								resource.sources = [reference, ...resource.sources]
								// this will trigger a lookup in the sources, hence it happens after the source is added
								resource.nodes.input = r.name
							},
						})),
				},
			})
		}
		if (resource.edgesInput == null) {
			result.push({
				key: 'add-edges',
				text: 'Link edges table',
				iconProps: { iconName: profileIcons.tablebundle },
				subMenuProps: {
					items: dp.resources
						.filter((r) => r.profile === 'tablebundle')
						.map((r) => ({
							key: r.name,
							text: r.name,
							onClick: () => {
								const reference = new ResourceReference()
								reference.target = r
								reference.rel = KnownRel.Input
								resource.sources = [reference, ...resource.sources]
								// this will trigger a lookup in the sources, hence it happens after the source is added
								resource.edges.input = r.name
							},
						})),
				},
			})
		}
		return result
	}

	public getHelp(): Record<string, string> {
		return content
	}

	public getToolboxItems() {
		return [{
			key: 'graph-derive-nodes-from-edges',
			title: 'Derive nodes from edges',
			renderer: DeriveNodesFromEdges,
		}]
	}
}
