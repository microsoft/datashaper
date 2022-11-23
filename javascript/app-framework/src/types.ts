/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'

export interface GeneratedRoute {
	path: string
	renderer: React.ComponentType<any>
	props: any
}

export interface ProfileHandlerPlugin<T extends Resource = any> {
	/**
	 * The profile name to register within the app framework.
	 * This is used to identify the plugin and should be unique.
	 */
	profile: string

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
	 * @param pathContext - The current path context being used for generation. This is the parent path of the resource.
	 */
	onGenerateRoutes?: (
		resource: T,
		pathContext: string,
	) => GeneratedRoute[] | undefined
}
