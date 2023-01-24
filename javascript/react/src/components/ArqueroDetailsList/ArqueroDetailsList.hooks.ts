/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field, SortDirection } from '@datashaper/schema'
import { columnTypes } from '@datashaper/tables'
import {
	GroupedListV2_unstable as GroupedListV2, type IColumn,
	type IDetailsGroupRenderProps,
	type IListProps
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { RowObject } from 'arquero/dist/types/table/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type {
	ArqueroDetailsListFeatures,
	GroupHeaderFunction
} from './ArqueroDetailsList.types.js'
import { debounceFn, groupBuilder } from './ArqueroDetailsList.utils.js'
import { useGroupHeaderRenderer, useSortedGroups } from './hooks/index.js'
import { useFill } from './hooks/useFill.js'
import { useItems } from './hooks/useItems.js'
export function useVirtualizedItems(
	table: ColumnTable,
	columns: IColumn[] | undefined,
	features: ArqueroDetailsListFeatures,
	fill: boolean,
	compact: boolean,
	compactRowHeight: number,
): {
	ref: React.MutableRefObject<HTMLDivElement | null>
	items: any[]
	virtual: ReturnType<typeof useFill>
} {
	const ref = useRef(null)
	const baseItems = useMemo<object[]>(() => [...table.objects()], [table])
	const virtual = useFill(table, columns, ref, fill, features, {
		compact,
		compactRowHeight,
	})
	const items = useItems(baseItems, virtual.virtualRows)

	return {
		items,
		virtual,
		ref,
	}
}

export function useGroups(
	table: ColumnTable,
	sliced: ColumnTable,
	items: any[],
	sortDirection: SortDirection | undefined,
	features: ArqueroDetailsListFeatures,
	sortColumn: string | undefined,
): undefined | Array<ReturnType<typeof groupBuilder>> {
	// if the table is grouped, groups the information in a way we can iterate
	const groupedEntries = useGroupedEntries(table, sliced)
	// sorts first level group headers
	const sortedGroups = useSortedGroups(
		table,
		sortColumn,
		sortDirection,
		groupedEntries,
	)

	return useMemo(() => {
		if (!sliced.isGrouped()) {
			return undefined
		}

		const existingGroups = sliced.groups()
		const totalLevelCount = existingGroups.names.length

		return sortedGroups?.map((row: RowObject) => {
			const initialLevel = 0
			return groupBuilder(
				row,
				existingGroups,
				initialLevel,
				totalLevelCount,
				items,
				sortDirection,
				features.lazyLoadGroups,
				sortColumn,
			)
		})
	}, [sliced, sortedGroups, items, sortColumn, sortDirection, features])
}

/**
 * If the table is grouped, groups the information in a way we can iterate
 */
function useGroupedEntries(
	table: ColumnTable,
	sliced: ColumnTable,
): object[] | undefined {
	return useMemo(
		() =>
			table.isGrouped() ? sliced.objects({ grouped: 'entries' }) : undefined,
		[sliced, table],
	)
}

/**
 * As in FluentUI documentation, when updating item we can update the list items with a spread operator.
 * since when adding a new column we're changing the columns prop too, this approach doesn't work for that.
 * a workaround found in the issues suggest to use this version property to use as comparison to force re-render
 */
export function useVersion(
	table: ColumnTable,
	columns: IColumn[] | undefined,
	compact: boolean,
): [number, React.Dispatch<React.SetStateAction<number>>] {
	const [version, setVersion] = useState(0)
	useEffect(() => {
		setVersion((prev) => prev + 1)
	}, [columns, table, compact])
	return [version, setVersion]
}

export function useOnColumnResizeHandler(
	setVersion: React.Dispatch<React.SetStateAction<number>>,
): (column: IColumn | undefined, newWidth: number | undefined) => void {
	return useCallback(
		(column: IColumn | undefined, newWidth: number | undefined) => {
			const set = () => setVersion((prev) => prev + 1)
			if (column?.currentWidth !== newWidth) {
				debounceFn(set)
			}
		},
		[setVersion],
	)
}

/**
 * Ensures every key is unique
 */
export function useGetKey(): (_: any, index?: number) => string {
	return useCallback((_: any, index?: number) => {
		return (index as number).toString()
	}, [])
}

export function useGroupProps(
	table: ColumnTable,
	fields: Field[],
	onRenderGroupHeader: GroupHeaderFunction | undefined,
	features: ArqueroDetailsListFeatures,
): IDetailsGroupRenderProps {
	const onRenderHeader = useGroupHeaderRenderer(
		table,
		fields,
		onRenderGroupHeader,
		features.lazyLoadGroups,
	)
						
	return useMemo(() => ({ onRenderHeader, groupedListAs: GroupedListV2, }), [onRenderHeader])
}

export function useListProps(version: number): IListProps<any> {
	return useMemo(() => ({ version }), [version])
}

export function useFields(table: ColumnTable, fields?: Field[]): Field[] {
	// TODO: this uses the older type determination, which is not as sophisticated as our new codebook.
	// however, dates are well detected in the new codebooks, but not well parsed.
	return useMemo(() => {
		if (fields) {
			return fields
		}
		const types = columnTypes(table)
		return Object.entries(types).map(([name, type]) => ({
			name,
			type,
		}))
	}, [table, fields])
}
