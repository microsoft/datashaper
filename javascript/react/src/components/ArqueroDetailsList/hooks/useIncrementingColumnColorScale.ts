/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

/**
 * Creates a thematic nominal color scale function that auto-increments for the numeric columns in a table.
 * @param meta -
 * @returns
 */
export function useIncrementingColumnColorScale(
	meta?: TableMetadata,
): () => string {
	const theme = useThematic()
	const count = useMemo(() => countNumeric(meta), [meta])
	const scale = useMemo(() => theme.scales().nominal(count), [theme, count])
	return useMemo(() => {
		let index = 0
		return () => scale(index++).hex()
	}, [scale])
}

function countNumeric(meta?: TableMetadata): number {
	if (!meta) return 1
	return Object.values(meta.columns).reduce((acc, cur) => {
		return acc + (cur.type === DataType.Number ? 1 : 0)
	}, 0)
}
