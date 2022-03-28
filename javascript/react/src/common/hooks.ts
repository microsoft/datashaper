/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnRecordArgs,
	Step,
	TableContainer,
	TableStore,
	Value,
	Pipeline,
} from '@data-wrangling-components/core'
import {
	columnType,
	createTableStore,
	DataType,
	createPipeline,
} from '@data-wrangling-components/core'
import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	IDropdownOption,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import isArray from 'lodash-es/isArray.js'
import set from 'lodash-es/set.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { DetailsListFeatures } from '../index.js'
import type {
	DropdownOptionChangeFunction,
	StepChangeFunction,
} from '../types.js'

const noop = (value?: string) => value
const num = (value?: string) => value && +value

/**
 * Make a basic set of string options from an array
 * @param list -
 * @returns
 */
export function useSimpleOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name.toString(),
			})),
		[list],
	)
}

/**
 * Creates a list of dropdown options from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store -
 * @returns
 */
export function useTableOptions(store?: TableStore): IDropdownOption[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		return store?.onChange(() => setDirty(true))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list().sort() || [])
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleOptions(list)
}

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table -
 * @returns
 */
export function useTableColumnOptions(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): IDropdownOption[] {
	return useSimpleOptions(table?.columnNames(filter) || [])
}

export function useColumnValueOptions(
	column: string,
	table: ColumnTable | undefined,
	values?: Value[],
	filter?: (value: Value) => boolean,
): IDropdownOption[] {
	const vals = useMemo(() => {
		if (!table || !column || column.trim().length === 0) {
			return []
		}
		const getFallback = () => {
			const columnNamesArray: string[] = table
				.columnNames()
				.filter(e => e === column)

			if (columnNamesArray.length !== 0) {
				const result: any[] = table
					.rollup({
						[column]: op.array_agg_distinct(column),
					})
					.get(column, 0)

				return result ?? []
			}

			return []
		}
		const list = values ? values : getFallback()
		return filter ? list.filter(filter) : list
	}, [column, table, values, filter])
	return useSimpleOptions(vals)
}

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useHandleDropdownChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
): DropdownOptionChangeFunction {
	return useCallback(
		(_event, option) => {
			const update = cloneDeep(step)
			set(update, path, option?.key)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useHandleTextfieldChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = noop,
): (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			set(update, path, value)
			onChange && onChange(update)
		},
		[step, path, onChange, transformer],
	)
}

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step -
 * @param path -
 * @param onChange -
 * @param transformer -
 * @returns
 */
export function useHandleSpinButtonChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = num,
): (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => void {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			if (typeof value === 'number') {
				set(update, path, value)
				onChange && onChange(update)
			}
		},
		[step, path, onChange, transformer],
	)
}

export function useHandleCheckboxChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
): (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void {
	return useCallback(
		(_event, checked) => {
			const update = cloneDeep(step)
			set(update, path, checked)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useColumnRecordDelete(
	step: Step,
	onChange?: StepChangeFunction,
): (column: string) => void {
	return useCallback(
		column => {
			const internal = step as Step<InputColumnRecordArgs>
			const args = { ...internal.args }
			delete args.columns[column]
			onChange &&
				onChange({
					...step,
					args: {
						...internal.args,
						...args,
					},
				})
		},
		[step, onChange],
	)
}

export function useLoadTable(
	id: string | undefined,
	table?: ColumnTable,
	store?: TableStore,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()
	const handleTableLoad = useCallback(
		(container: TableContainer | undefined) => setTable(container?.table),
		[setTable],
	)
	useEffect(() => {
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (table) {
			setTable(table)
		} else if (id && store) {
			const sub = store.observe(id).subscribe(t => setTable(t?.table))
			return () => sub.unsubscribe()
		}
	}, [id, table, store, handleTableLoad])
	return tbl
}

export function useIntersection(
	element: HTMLDivElement | undefined,
	rootMargin: string,
): boolean {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry?.isIntersecting ?? false)
			},
			{ rootMargin },
		)
		element && observer.observe(element)

		return () => element && observer.unobserve(element)
	}, [element, rootMargin])

	return isVisible
}

export function useColumnType(table?: ColumnTable, column?: string): DataType {
	return useMemo(() => {
		if (!table || !column) {
			return DataType.Unknown
		}
		return columnType(table, column)
	}, [table, column])
}

export function useStore(): TableStore {
	return useMemo(() => createTableStore(), [])
}

export function useCommonCommands(
	showModal?: any | undefined,
	changeTableFeatures?: (name: string) => void,
	features?: Partial<DetailsListFeatures>,
): ICommandBarItemProps[] {
	const dccmd = useDeriveColumnCommand(showModal)
	const tshcmd = useToggleStatsHeaderCommand(changeTableFeatures, features)

	return useMemo(() => {
		const commands: ICommandBarItemProps[] = []

		if (dccmd) {
			commands.push(dccmd)
		}
		if (tshcmd) {
			commands.push(tshcmd)
		}
		return commands
	}, [dccmd, tshcmd])
}

export function useToggleStatsHeaderCommand(
	toggle?: (name: string) => void,
	features?: Partial<DetailsListFeatures>,
): ICommandBarItemProps | null {
	const cmd = useMemo(() => {
		return {
			key: 'toggle-stats',
			iconOnly: true,
			text: 'Toggle header features',
			ariaLabel: 'Toggle header features',
			iconProps: iconProps.settings,
			subMenuProps: {
				items: [
					{
						key: 'emailMessage',
						text: 'Column stats',
						iconProps: iconProps.stats,
						checked: features?.statsColumnHeaders,
						canCheck: true,
						onClick: () => toggle && toggle('statsColumnHeaders'),
					},
					{
						key: 'calendarEvent',
						text: 'Column histogram',
						iconProps: iconProps.barChart,
						checked: features?.histogramColumnHeaders,
						canCheck: true,
						onClick: () => toggle && toggle('histogramColumnHeaders'),
					},
				],
			},
		} as ICommandBarItemProps
	}, [toggle, features])
	if (!toggle && !features) return null

	return cmd
}

export function useDeriveColumnCommand(
	onClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void | undefined,
): ICommandBarItemProps | null {
	const cmd = useMemo(() => {
		return {
			key: 'derive-column',
			text: 'Create column',
			iconProps: iconProps.add,
			onClick,
		} as ICommandBarItemProps
	}, [onClick])
	if (!onClick) return null

	return cmd
}

const iconProps = {
	add: { iconName: 'Add' },
	settings: { iconName: 'Settings' },
	barChart: { iconName: 'BarChart4' },
	stats: { iconName: 'AllApps' },
}

export function useDeleteConfirm(onDelete?: (args: any) => void): {
	toggleDeleteModalOpen: () => void
	onConfirmDelete: () => void
	onDeleteClicked: (args: any) => void
	isDeleteModalOpen: boolean
} {
	const [deleteArg, setDeleteArg] = useState<any>()
	const [isDeleteModalOpen, { toggle: toggleDeleteModalOpen }] =
		useBoolean(false)

	const onDeleteClicked = useCallback(
		(args: any) => {
			setDeleteArg(args)
			toggleDeleteModalOpen()
		},
		[toggleDeleteModalOpen, setDeleteArg],
	)

	const onConfirmDelete = useCallback(() => {
		onDelete && onDelete(deleteArg)
		toggleDeleteModalOpen()
	}, [toggleDeleteModalOpen, deleteArg, onDelete])

	return {
		isDeleteModalOpen,
		onConfirmDelete,
		toggleDeleteModalOpen,
		onDeleteClicked,
	}
}

//TODO: separate column and table functions into a new hooks file
//OR move this functionality to the pipeline?
export function useCreateTableName(
	store?: TableStore,
): (name: string) => string {
	const verifyTableName = useCallback(
		(name: string): boolean => {
			return store ? store.list().includes(name) : false
		},
		[store],
	)

	return useCallback(
		(name: string): string => {
			const originalName = name.replace(/( \(\d+\))/, '')
			let derivedName = originalName
			let count = 1

			while (verifyTableName(derivedName)) {
				derivedName = `${originalName} (${count})`
				count++
			}
			return derivedName
		},
		[verifyTableName],
	)
}

export function useCreateColumnName(): (
	name: string,
	columnNames: string[],
) => string {
	const verifyColumnName = useCallback(
		(name: string, columnNames: string[]): boolean => {
			return columnNames.includes(name)
		},
		[],
	)

	return useCallback(
		(name: string, columnNames: string[]) => {
			const originalName = name.replace(/( \(\d+\))/, '')
			let derivedName = originalName

			let count = 1
			while (verifyColumnName(derivedName, columnNames)) {
				derivedName = `${originalName} (${count})`
				count++
			}
			return derivedName
		},
		[verifyColumnName],
	)
}

export function useFormatedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => unknown {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(x => {
			if (x === 'to' && !isArray(args[x])) args[x] = newName
		})
		return args
	}, [])
}

export function useFormatedColumnArgWithCount(): (
	step: Step,
	columnNames: string[],
) => unknown {
	const createColumnName = useCreateColumnName()

	return useCallback(
		(step: Step, columnNames) => {
			let args = step.args as Record<string, unknown>
			Object.keys(args).forEach(x => {
				if (x === 'to' && !isArray(args[x])) {
					const newColumnName = createColumnName(args[x] as string, columnNames)
					args = { ...args, [x]: newColumnName }
				}
			})
			return args
		},
		[createColumnName],
	)
}

export function usePipeline(store: TableStore): Pipeline {
	return useMemo(() => createPipeline(store), [store])
}
