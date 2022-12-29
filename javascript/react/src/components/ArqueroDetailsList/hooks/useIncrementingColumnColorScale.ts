/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
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
	return useMemo(() => {
		const c = theme.rect().fill().hex()
		return () => c
	}, [theme])
}
