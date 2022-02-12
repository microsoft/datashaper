/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TableStore,
	Step,
	InputColumnRecordArgs,
	Value,
	DataType,
	columnType,
	Pipeline,
} from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import {
	ICommandBarItemProps,
	IContextualMenuItem,
	IDropdownOption,
} from '@fluentui/react'
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { set } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DetailsListFeatures } from '../'
import {
	DropdownOptionChangeFunction,
	GroupedTable,
	StepChangeFunction,
	TableGroup,
} from '../types'

const noop = (value?: string) => value
const num = (value?: string) => value && +value

/**
 * Make a basic set of string options from an array
 * @param list
 * @returns
 */
export function useSimpleOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name,
			})),
		[list],
	)
}

/**
 * Creates a list of dropdown options from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store
 * @returns
 */
export function useTableOptions(store?: TableStore): IDropdownOption[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		store?.addChangeListener(() => setDirty(true))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list() || [])
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleOptions(list)
}

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table
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
		if (!table) {
			return []
		}
		const list = values
			? values
			: table
					.rollup({
						[column]: op.array_agg(column),
					})
					.objects()[0][column]
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
		(event, option) => {
			const update = {
				...step,
			}
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
		(event, newValue) => {
			const update = {
				...step,
			}
			const value = transformer(newValue)
			set(update, path, value)
			onChange && onChange(update)
		},
		[step, path, onChange, transformer],
	)
}

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step
 * @param path
 * @param onChange
 * @param transformer
 * @returns
 */
export function useHandleSpinButtonChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = num,
): (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => void {
	return useCallback(
		(event, newValue) => {
			const update = {
				...step,
			}
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
		(event, checked) => {
			const update = {
				...step,
			}
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
	name: string | undefined,
	table?: ColumnTable,
	store?: TableStore,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()
	useEffect(() => {
		const fn = async (n: string, s: TableStore) => {
			try {
				s.listen(n, setTable)
				const t = await s.get(n)
				setTable(t)
			} catch (e) {
				// swallow the error - we may try to request async before the table is registered
				// it'll get picked up later by the listener
				// TODO: should we only listen if it fails at first?
			}
		}
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (table) {
			setTable(table)
		} else if (name && store) {
			fn(name, store)
		}
		return () => {
			name && store && store.unlisten(name)
		}
	}, [name, table, store, setTable])
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
				setState(entry.isIntersecting)
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
	return useMemo(() => new TableStore(), [])
}

export function usePipeline(store: TableStore): Pipeline {
	return useMemo(() => new Pipeline(store), [store])
}

export function useGroupedTables(
	intermediary: string[],
	tables: BaseFile[],
	outputs: Map<string, ColumnTable>,
): GroupedTable[] {
	return useMemo(() => {
		return Array.from(outputs).map(([key, table]) => {
			return {
				name: key,
				table: table,
				group: intermediary.includes(key)
					? TableGroup.Intermediary
					: TableGroup.Input,
			} as GroupedTable
		})
	}, [tables, intermediary, outputs]) //fix here
	// useEffect(() => {
	// 	const f = async () => {
	// 		const results = await store.toMap()
	// 		const groupedTables = Array.from(results).map(([key, table]) => {
	// 			return {
	// 				name: key,
	// 				table: table,
	// 				group: intermediary.includes(key)
	// 					? TableGroup.Intermediary
	// 					: TableGroup.Input,
	// 			} as GroupedTable
	// 		})
	// 		setA(groupedTables)
	// 	}
	// 	f()
	// }, [intermediary, tables, store])
	// return a
}

export function useCommonCommands(
	showModal: any | undefined,
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

export function useToggleStatsHeaderCommand(
	toggle?: (name: string) => void,
	features?: Partial<DetailsListFeatures>,
): ICommandBarItemProps | null {
	const cmd = useMemo(() => {
		return {
			key: 'toggle-stats',
			iconOnly: true,
			text: 'Toggle header features',
			iconProps: iconProps.bar,
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

export function useToggleTableFeatures(
	features?: Partial<DetailsListFeatures>,
): {
	changeTableFeatures: (feature: string) => void
	tableFeatures: Partial<DetailsListFeatures>
} {
	const [tableFeatures, setTableFeatures] = useState<
		Partial<DetailsListFeatures>
	>(features ?? {})

	const changeTableFeatures = useCallback(
		(feature: string) => {
			setTableFeatures(prev => {
				return {
					...prev,
					[feature]: !prev[feature],
				}
			})
		},
		[setTableFeatures],
	)
	return {
		changeTableFeatures,
		tableFeatures,
	}
}

const iconProps = {
	add: { iconName: 'Add' },
	bar: { iconName: 'BarChartVerticalFilterSolid' },
	barChart: { iconName: 'BarChart4' },
	stats: { iconName: 'AllApps' },
}
