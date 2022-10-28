/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useBarColor(color: string | undefined): string {
	const theme = useThematic()
	return useMemo(() => color || theme.rect().fill().hex(), [theme, color])
}
