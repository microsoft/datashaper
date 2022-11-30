/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource, ResourceHandler } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

/**
 * Data attached to resource-tree nodes
 */
export interface ResourceRoute {
	/**
	 * The resource render route
	 */
	href: string

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
	renderer: React.ComponentType<any>

	/**
	 * The render props to use for this node
	 */
	props: any
}

export interface AppServices {
	/**
	 * Show the resource rename dialog
	 * @param resource - the resource to rename
	 */
	renameResource(resource: Resource): Promise<string>
}

export interface ProfilePlugin<T extends Resource = any> {
	/**
	 * The profile name to register within the app framework.
	 * This is used to identify the plugin and should be unique.
	 */
	profile: string

	/**
	 * A friendly title for the profile, used for resource creation. (e.g. "New <title>")
	 */
	title: string

	/**
	 * The grouping for this resource type. The default is 'app'.
	 * This grouping determines what resources this is rendered with in the tree-view.
	 */
	group?: ResourceGroup

	/**
	 * The icon name to use in the file-tree
	 */
	iconName: string

	/**
	 * Determines whether this profile can be created from the 'new' menu
	 */
	isTopLevel?: boolean

	/**
	 * Initialize the plugin with application-level services
	 */
	initialize?: (api: AppServices) => void

	/**
	 * Render the plugin
	 */
	renderer: React.ComponentType<{ resource: T }>

	/**
	 * The persistence handler to use for this profile
	 */
	dataHandler?: ResourceHandler

	/**
	 * Creates a new resource of this type
	 */
	createResource: () => T

	/**
	 * Create contextual menu items for a resource
	 */
	onGetMenuItems?: (resource: T) => IContextualMenuItem[]

	/**
	 * Event handler for when the resource is undergoing route generation.
	 * A route is always generated for the resource; any related routes may be retured here.
	 *
	 * @param resource - The resource that routes are being generated for.
	 * @param parentPath - The current path context being used for generation. This is the parent path of the resource.
	 * @param resourcePath - The resource path that was used for the resource.
	 */
	onGetRoutes?: (
		resource: T,
		parentPath: string,
		resourcePath: string,
	) =>
		| {
				preItemSiblings?: ResourceRoute[]
				postItemSiblings?: ResourceRoute[]
				children?: ResourceRoute[]
		  }
		| undefined
}

export enum ResourceGroup {
	Data = 'data',
	Apps = 'apps',
}
