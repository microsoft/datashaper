/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'

import type { ProfilePlugin } from '../../../types.js'
import type { FileDefinition } from '../ResourcesPane/index.js'

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
	 * The React node to render when the selected resource cannot be found
	 */
	fallback?: React.ReactNode

	/**
	 * Custom profile renderers
	 */
	profiles?: ProfilePlugin[]
}
