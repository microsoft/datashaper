/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FileDefinition, ResourceTreeData } from '../resources/index.js'

export interface DataShaperAppProps {
	examples?: FileDefinition[]

	/**
	 * The application resources to render in the file tree.
	 * TODO: this should be handled internally
	 */
	appResources: ResourceTreeData
	/**
	 * The child node to render
	 * TODO: handle this internally
	 */
	children: React.ReactNode
}
