/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type { FieldWellItem } from '@datashaper/react'
import type { IContextualMenuItem } from '@fluentui/react'
import type {
	Resource,
	DataPackage,
	ProfileHandler,
} from '@datashaper/workflow'
/**
 * Data attached to resource-tree nodes
 */
export interface ResourceRoute {
	key: string
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

	fieldWells?: FieldWellItem[]
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

/**
 * Classes implementing this interface are used to represent the Profile within the app framework.
 * This largely includes user interface elements that build upon the underlying Profile functionality.
 */
export interface AppProfile<
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
	 * Render the profile
	 */
	renderer: React.ComponentType<{
		href: string
		resource: Res
		api: AppServices
	}>

	/**
	 * Gets commands for the profile
	 */
	getCommandBarCommands?: (
		section: CommandBarSection,
	) => IContextualMenuItem[] | undefined

	/**
	 * Create contextual menu items for a resource
	 */
	getMenuItems?: (resource: Res) => IContextualMenuItem[]

	/**
	 * Profiles can indicate interactive field wells to display directly in the resource tree.
	 * These field wells can be populated by the resources, and will be rendered as a dropdown.
	 * Each field well can also dictate an onChange that updates the resource (e.g., sets an input binding).
	 * @param resource
	 * @returns
	 */
	getFieldWells?: (resource: Res) => FieldWellItem[]
	/**
	 * Profiles may supply a map of help content to be displayed in the global panel when open.
	 * Each help record should have a unique key, and the value is the markdown content.
	 * @returns
	 */
	getHelp?: () => Record<string, string>
	/**
	 * Profiles may supply a block of settings values that the user can configure.
	 * These will be displayed/edited in a centralized UX, and passed as props to the profile renderer.
	 * @returns 
	 */
	getSettings?: () => Record<string, string | number | boolean>
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

export interface ProfileComponentProps<T extends Resource> {
	resource: T
}

export enum ResourceTreeViewMode {
	Expanded = 'expanded',
	Collapsed = 'collapsed',
	Hidden = 'hidden',
}

export interface ApplicationSettings {
	darkMode?: boolean
}
