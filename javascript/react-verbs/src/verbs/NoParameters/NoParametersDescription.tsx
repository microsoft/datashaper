/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'

export const NoParametersDescription: React.FC<StepDescriptionProps<void>> =
	memo(function NoParametersDescription(props) {
		const rows = useMemo(() => {
			return []
		}, [])
		return <VerbDescription {...props} rows={rows} />
	})
