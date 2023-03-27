/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices } from '../../../types.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'
import type { FileDefinition } from '../ResourcesPane/ResourcesPane.types.js'

export interface AppResourcesProps {
	api: AppServices
	profiles: DataShaperAppProps['profiles']
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
