/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type {
	DataPackage,
	ProfileHandler,
	Resource,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

/**
 * Data attached to resource-tree nodes
 */
export interface ResourceRoute {
	/**
	 * The resource render route
	 */
	href?: string

	/**
	 * The node text to use. Default=id
	 */
	title: string

	/**
	 * The icon to use in the file tree
	 */
	icon?: string

	/**
	 * Child node Data
	 */
	children?: ResourceRoute[]

	/**
	 * Contextual Menu items for this resource
	 */
	menuItems?: IContextualMenuItem[]

	/**
	 * The renderer to use for this node
	 */
	renderer?: React.ComponentType<any>

	/**
	 * The render props to use for this node
	 */
	props?: any
}

export interface AppServices {
	/**
	 * Show the resource rename dialog
	 * @param resource - the resource to rename
	 */
	renameResource(resource: Resource): Promise<string>
	/**
	 * Set the current context-sensitive help key,
	 * which the user can see if the global help pane is open.
	 * @param key
	 */
	requestHelp(key: string): void
}

export interface AppProfileInitializationContext {
	dataPackage: DataPackage
	api: AppServices
}

export interface ProfilePlugin<
	Res extends Resource = Resource,
	Schema extends ResourceSchema = ResourceSchema,
> extends ProfileHandler<Res, Schema, AppProfileInitializationContext> {
	/**
	 * A friendly title for the profile, used for resource creation. (e.g. "New <title>")
	 */
	title: string

	/**
	 * The grouping for this resource type. The default is 'app'.
	 * This grouping determines what resources this is rendered with in the tree-view.
	 */
	group?: ResourceGroupType

	/**
	 * The icon name to use in the file-tree
	 */
	iconName: string

	/**
	 * Render the plugin
	 */
	renderer: React.ComponentType<{
		href: string
		resource: Res
		api: AppServices
	}>

	/**
	 * Gets commands for the plugin
	 */
	getCommandBarCommands?: (
		section: CommandBarSection,
	) => IContextualMenuItem[] | undefined

	/**
	 * Create contextual menu items for a resource
	 */
	getMenuItems?: (resource: Res) => IContextualMenuItem[]

	/**
	 * Plugins may supply a map of help content to be displayed in the global panel when open.
	 * Each help record should have a unique key, and the value is the markdown content.
	 * @returns
	 */
	getHelp?: () => Record<string, string>
}

export enum CommandBarSection {
	New = 'newMenu',
	Open = 'openMenu',
	Save = 'saveMenu',
}

export enum ResourceGroupType {
	Data = 'data',
	Apps = 'apps',
}

export interface ResourceRouteGroup {
	type: ResourceGroupType
	resources: ResourceRoute[]
}

export interface PluginComponentProps<T extends Resource> {
	resource: T
}
