import type { Workflow } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'

export interface PrepareDataFullProps {
	/**
	 * The static input tables
	 */
	inputs: TableContainer[]

	/**
	 * Derived output tables
	 */
	derived: TableContainer[]

	/**
	 * The data transformation workflow
	 */
	workflow: Workflow

	/**
	 * An optional command bar
	 */
	outputHeaderCommandBar?: IRenderFunction<IDetailsColumnProps>[]

	/**
	 * Step positioning option
	 */
	stepsPosition?: 'bottom' | 'middle'

	/**
	 * Handler for when the output table map changes
	 */
	onUpdateOutput?: (tables: TableContainer[]) => void
}
