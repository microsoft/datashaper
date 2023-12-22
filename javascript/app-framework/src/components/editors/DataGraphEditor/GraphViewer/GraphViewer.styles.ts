/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from "@thematic/react"
import { useMemo } from "react"

export function useSigmaStyles() {
	const theme = useThematic()
	return useMemo(() => ({
		height: '100%',
		width: '100%',
		background: theme.plotArea().fill().hex(),
	}), [theme])
}
