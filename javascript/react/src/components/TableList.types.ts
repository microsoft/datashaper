import type { TableContainer } from '@essex/arquero'

export interface TableListProps {
	tables: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
}
