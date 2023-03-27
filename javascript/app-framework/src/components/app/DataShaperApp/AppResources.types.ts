import { AppServices } from '../../../types.js'
import { DataShaperAppProps } from './DataShaperApp.types.js'
import { FileDefinition } from '../ResourcesPane/ResourcesPane.types.js'

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
