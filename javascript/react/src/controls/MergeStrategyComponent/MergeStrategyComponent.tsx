/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { useHandleDropdownChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { MergeStrategyDropdown } from '../dropdowns/MergeStrategyDropdown.js'

export const MergeStrategyComponent: React.FC<StepComponentProps> = memo(
	function StrategyComponent({ step, onChange }) {
		const internal = useMemo(() => step as MergeStep, [step])

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
