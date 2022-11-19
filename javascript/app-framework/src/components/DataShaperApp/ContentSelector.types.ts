/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SchemaResource } from '@datashaper/workflow'

import type {
	DataShaperPlugin,
	DataShaperPluginInstance,
} from './DataShaperApp.types.js'

export interface ContentSelectorProps {
	/**
	 * The application plugins
	 */
	plugins: DataShaperPlugin[]

	/**
	 * The selected resource data
	 */
	selectedResource?: SchemaResource<unknown>

	/**
	 * The selected plugin instance
	 */
	selectedPluginInstance?: DataShaperPluginInstance

	/**
	 * The child node to render as the "Front Page" of the app.
	 * This is the default view when no resource is selected
	 */
	children: React.ReactNode
}
