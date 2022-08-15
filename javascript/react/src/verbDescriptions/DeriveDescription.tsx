/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@datashaper/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const DeriveDescription: React.FC<StepDescriptionProps<DeriveArgs>> =
	memo(function DeriveDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					value: `${args.column1 || ''} ${args.operator || ''} ${
						args.column2 || ''
					}`,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
