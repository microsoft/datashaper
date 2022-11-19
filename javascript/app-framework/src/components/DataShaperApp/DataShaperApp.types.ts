/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'
import type { Observable } from 'rxjs'

import type { FileDefinition, ResourceTreeData } from '../resources/index.js'

export interface DataShaperAppProps {
	/**
	 * CSS Classname
	 */
	className?: string

	/**
	 * Examples to provide
	 */
	examples?: FileDefinition[]

	/**
	 * The child node to render as the "Front Page" of the app.
	 * This is the default view when no resource is selected
	 */
	children: React.ReactNode

	/**
	 * The currently selected route
	 */
	selectedKey?: string

	/**
	 * Handle selection of a resource tree item
	 */
	onSelect?: (resource: ResourceTreeData) => void

	/**
	 * Custom resource renderers
	 */
	plugins?: DataShaperPlugin[]
}

export interface DataShaperPlugin {
	/**
	 * The profile name to register within the app framework.
	 * This is used to identify the plugin and should be unique.
	 */
	profile: string

	/**
	 * Render the plugin
	 */
	render: (instance: DataShaperPluginInstance) => React.ReactNode

	/**
	 * Creates a new application instance
	 *
	 * @id - The unique id of the instance
	 * @initialData - The initial data of the application instance
	 */
	createInstance: (id: string, initialData?: Blob) => DataShaperPluginInstance
}

/**
 * Interface for an application instance.
 * Applications may have multiple instance in-memory to support comparitive analytics.
 * Each instance may persist out into the project zip independently.
 */
export interface DataShaperPluginInstance {
	/**
	 * The unique ID for this application instance. This will be used to generate the
	 * filename in the project zip.
	 */
	id: string

	/**
	 * Observes the ID of this instances
	 */
	id$: Observable<string>

	/**
	 * Gets the instance data as a blob
	 */
	getData(): Promise<Blob>
}
