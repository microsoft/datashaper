/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'

export interface DataShaperAppPlugin {
	/**
	 * The profile name to register within the app framework.
	 * This is used to identify the plugin and should be unique.
	 */
	profile: string

	/**
	 * The icon name to use in the file-tree
	 */
	fileTreeIconName: string

	/**
	 * Render the plugin
	 */
	renderer: React.ComponentType<{ resource: unknown }>
}
