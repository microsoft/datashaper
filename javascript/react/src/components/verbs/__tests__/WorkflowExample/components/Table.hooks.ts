/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn, ICommandBarProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

import { useHeaderCommandBarDefaults } from '../../../../../hooks/index.js'
import { downloadCommand } from '../../../../ArqueroTableHeader/index.js'
import type { ColumnConfigMap } from './Table.types.js'

export function useFarCommandBar(table: ColumnTable): ICommandBarProps {
	const items = useMemo(() => [downloadCommand(table)], [table])
	return useHeaderCommandBarDefaults({ items }, true)
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
