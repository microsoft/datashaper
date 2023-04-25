/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'

import type { AppProfile, ResourceTreeViewMode } from '../../../types.js'
import type { FileDefinition } from '../ResourcesPane/index.js'

export interface DataShaperAppProps<T = unknown> {
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
	 * The React node to render when the selected resource cannot be found
	 */
	fallback?: React.ReactNode

	/**
	 * Custom profile renderers
	 */
	profiles?: AppProfile[]

	/**
	 * Indicates the help content to show when the application has no resources selected.
	 */
	defaultHelp?: string

	/**
	 * Object of user-definable application-level settings.
	 */
	defaultSettings?: unknown

	/**
	 * The default view mode to use on load
	 */
	defaultResourceTreeViewMode?: ResourceTreeViewMode

	/**
	 * The initial data-package URL to load (useful for demos)
	 */
	initialDataPackageUrl?: string

	/**
	 * The initial route to load (useful for demos).
	 * Resources are routed under `/resource/{resource.name}`
	 */
	initialRoute?: string
	/**
	 * Apps may supply an arbitrary context object that will be passed down to resources.
	 * This provides a seam for injecting app-specific functionality into resources such as async pre-load setup.
	 */
	appContext?: T
}
