/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'

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
	 * The renderer to use for this node
	 */
	renderer: React.ComponentType<any>

	/**
	 * The render props to use for this node
	 */
	props: any
}

export interface ProfileHandlerPlugin<T extends Resource = any> {
	/**
	 * The profile name to register within the app framework.
	 * This is used to identify the plugin and should be unique.
	 */
	profile: string

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
	 * Render the plugin
	 */
	renderer: React.ComponentType<{ resource: T }>

	/**
	 * Event handler for when the resource is undergoing route generation.
	 * A route is always generated for the resource; any related routes may be retured here.
	 *
	 * @param resource - The resource that routes are being generated for.
	 * @param parentPath - The current path context being used for generation. This is the parent path of the resource.
	 * @param resourcePath - The resource path that was used for the resource.
	 */
	onGenerateRoutes?: (
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
