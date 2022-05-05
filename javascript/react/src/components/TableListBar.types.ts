import type { TableContainer } from '@essex/arquero'

export interface TableListBarProps {
	/**
	 * The input tables
	 */
	inputs: TableContainer[]

	/**
	 * The output tables
	 */
	derived: TableContainer[]

	/**
	 * The table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * The selected table id
	 */
	selected?: string

	/**
	 * The load-state
	 */
	loading?: boolean
}
