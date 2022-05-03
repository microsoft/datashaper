/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'

export const OneHotDescription: React.FC<StepDescriptionProps<OnehotArgs>> =
	memo(function OneHotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column',
					value: args.column,
				},
				{
					before: 'with prefix',
					value: args.prefix,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
