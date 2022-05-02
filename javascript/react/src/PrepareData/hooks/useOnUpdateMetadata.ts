/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableStore } from '@data-wrangling-components/core'
import type { TableMetadata } from '@essex/arquero'
import { useCallback } from 'react'

export function useOnUpdateMetadata(
	store: TableStore,
	selectedTableName?: string,
): (meta: TableMetadata) => void {
	return useCallback(
		(meta: TableMetadata) => {
			const _table = store.get(selectedTableName as string)
			if (_table) {
				_table.metadata = meta
				store.delete(_table.id)
				store.emitItemChange(_table.id)
			}
		},
		[store, selectedTableName],
	)
}
