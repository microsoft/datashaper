/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ContentSelectorProps {
	handler?: string
	args?: string[]
	handlers?: Record<string, React.ComponentType<{ args: string[] }>>

	/**
	 * The child node to render as the "Front Page" of the app.
	 * This is the default view when no resource is selected
	 */
	children: React.ReactNode
}
