import type { Resource } from '@datashaper/workflow'
import { AppServices } from '../../../types.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'

export interface AppContentProps {
	profiles: DataShaperAppProps['profiles']
	children: React.ReactNode
	fallback: React.ReactNode
	api: AppServices
	rename: RenameModalState
}

interface RenameModalState {
	resource: Resource | undefined
	isOpen: boolean
	onDismiss: () => void
	onAccept: (name: string | undefined) => void
}
