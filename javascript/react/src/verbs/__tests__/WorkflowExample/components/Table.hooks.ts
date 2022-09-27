/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createDefaultHeaderCommandBar,
	downloadCommand,
} from '@datashaper/react'
import type { IColumn } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import type { ColumnConfigMap } from './Table.types.js'

export function useFarCommandBar(table: ColumnTable): JSX.Element {
	const theme = useTheme()
	const items = useMemo(() => [downloadCommand(table)], [table])
	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme, true),
		[items, theme],
	)
}

export function useColumns(config?: ColumnConfigMap): IColumn[] | undefined {
	return useMemo(() => {
		if (config) {
			return Object.entries(config).map(([key, conf]) => ({
				key,
				name: key,
				fieldName: key,
				minWidth: conf.width,
				iconName: conf.iconName,
			})) as IColumn[]
		}
	}, [config])
}
