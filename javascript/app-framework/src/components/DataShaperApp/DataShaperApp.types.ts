/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'

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
	 * The application resources to render in the file tree.
	 * TODO: this should be handled internally
	 */
	appResources?: ResourceTreeData[]
	/**
	 * The child node to render
	 * TODO: handle this internally
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
	 * The default component to render when no resource is selected
	 */
	frontPage?: React.ComponentType

	/**
	 * Custom resource renderers
	 */
	handlers?: Record<string, React.ComponentType<{ args: string[] }>>
}
