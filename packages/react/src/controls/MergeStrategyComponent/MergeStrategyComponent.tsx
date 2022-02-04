/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MergeStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { useLoadTable, useHandleDropdownChange } from '../../common'
import { StepComponentProps } from '../../types'
import { MergeStrategyDropdown } from '../dropdowns/MergeStrategyDropdown'

export const MergeStrategyComponent: React.FC<StepComponentProps> = memo(
	function StrategyComponent({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as MergeStep, [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const handleOpChange = useHandleDropdownChange(
			internal,
			'args.strategy',
			onChange,
		)

		const operatorDropdown = useMemo(() => {
			return (
				<MergeStrategyDropdown
					selectedKey={internal.args.strategy}
					onChange={handleOpChange}
				/>
			)
		}, [internal, handleOpChange])

		return <>{operatorDropdown}</>
	},
)
