/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs, Step } from '@data-wrangling-components/core'
import { ColumnSpread } from '../controls/index.js'

import set from 'lodash-es/set.js'
import { useMemo } from 'react'

export function useColumns(
	step: Step<SpreadArgs>,
	onChange?: (step: Step<SpreadArgs>) => void,
) {
	return useMemo(() => {
		return (step.args.to || []).map((column: string, index: number) => {
			const handleColumnChange = (col: string) => {
				const update = { ...step }
				set(update, `args.to[${index}]`, col)
				onChange?.(update)
			}

			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.to.splice(index, 1)
				onChange?.(update)
			}

			return (
				<ColumnSpread
					key={`column-list-${index}`}
					column={column}
					onChange={handleColumnChange}
					onDelete={handleDeleteClick}
				/>
			)
		})
	}, [step, onChange])
}
