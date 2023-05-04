/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppProfile, AppServices } from '../../../types.js'
import type { FileDefinition } from '../ResourcesPane/ResourcesPane.types.js'

export interface AppResourcesProps {
	api: AppServices
	appProfiles: Map<string, AppProfile>
	help: HelpState
	examples: FileDefinition[]
	expanded: boolean
	onToggleNarrow: () => void
}

export interface HelpState {
	helpContent: Record<string, string>
	onInitializeHelp: (help: Record<string, string>) => void
	currentHelp: string | undefined
}
