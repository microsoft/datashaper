/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeInput } from '@essex/dataflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { useLoadTable } from '@data-wrangling-components/react-hooks'

export function withLoadedTable<T>(
	StepComponent: React.ComponentType<
		StepComponentProps<T> & {
			dataTable: ColumnTable | undefined
		}
	>,
) {
	return function LoadedTable(props: StepComponentProps<T>): JSX.Element {
		const { step, table, graph, input } = props
		const dataTable = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			graph,
		)
		return <StepComponent {...props} dataTable={dataTable} />
	}
}
