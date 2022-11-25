/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHeaderCommandBarDefaults } from '@datashaper/react'
import type { TableContainer } from '@datashaper/tables'
import type { Step, TableBundle, Workflow } from '@datashaper/workflow'
import type {
	IColumn,
	ICommandBarItemProps,
	ICommandBarProps,
} from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
	buttonStyles,
	icons,
	useTableHeaderColors,
} from './BundleEditor.styles.js'

export function useSelectedTable(
	bundle: TableBundle,
	selectedTableId: string | undefined,
): TableContainer | undefined {
	return useMemo((): TableContainer | undefined => {
		if (bundle.name === selectedTableId && bundle?.input != null) {
			// if we select the original table name, use the workflow default input
			return { table: bundle.input.output, id: selectedTableId ?? '' }
		} else {
			// try to use the given table name to read the step, otherwise use the default output
			const table = bundle.workflow?.read(selectedTableId)
			const defaultOutput = bundle.workflow?.read()
			return table ?? defaultOutput
		}
	}, [bundle, selectedTableId])
}

export function useColumnState(): [
	string | undefined,
	(ev?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => void,
] {
	const [selectedColumn, setSelectedColumn] = useState<string | undefined>()
	const onColumnClick = useCallback(
		(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
			setSelectedColumn(prev =>
				prev === column?.name ? undefined : column?.name,
			)
		},
		[setSelectedColumn],
	)
	return [selectedColumn, onColumnClick]
}

export function useTableName(
	dataTable: TableBundle,
	selectedTableId: string | undefined,
): string {
	const { workflow } = dataTable
	return useMemo(() => {
		let name: string | undefined = undefined
		if (workflow != null) {
			const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
			// if the step index is the final step, use the default datatable name
			if (stepIndex < workflow.steps.length - 1) {
				const step = workflow.steps[stepIndex]
				name = (step?.id || step?.verb)?.toLocaleUpperCase()
			}
		}
		return name || dataTable.name
	}, [workflow, selectedTableId, dataTable.name])
}

export function useStepListener(
	workflow: Workflow,
	setSelectedTableId: (tableId: string) => void,
	inputNames: string[],
): void {
	useEffect(() => {
		if (workflow.steps.length > 0) {
			const { id } = workflow.steps[workflow.steps.length - 1] as Step
			setSelectedTableId(id)
		} else {
			if (workflow.inputNames.length > 0) {
				const lastInputName = inputNames[workflow.inputNames.length - 1]
				if (lastInputName) {
					setSelectedTableId(lastInputName)
				}
			}
		}
	}, [workflow, inputNames, setSelectedTableId])
}

export function useHistoryButtonCommandBar(
	isCollapsed: boolean,
	numSteps: number | undefined,
	toggleCollapsed: () => void,
): ICommandBarProps {
	const base = useMemo(
		() => ({
			items: [
				{
					key: 'historyButton',
					id: 'historyButton',
					disabled: !isCollapsed,
					text: `(${numSteps ?? '0'})`,
					iconProps: icons.history,
					onClick: toggleCollapsed,
					buttonStyles,
				} as ICommandBarItemProps,
			],
			id: 'historyButton',
			styles: {
				root: {
					height: 43,
				},
			},
		}),
		[isCollapsed, numSteps, toggleCollapsed],
	)
	const colors = useTableHeaderColors()
	return useHeaderCommandBarDefaults(base, true, colors)
}
