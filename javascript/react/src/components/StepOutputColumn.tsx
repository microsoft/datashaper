/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OutputColumnArgs, Step } from '@data-wrangling-components/core'
import { isOutputColumnStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { useTextFieldChangeHandler } from '../hooks/index.js'
import { dropdownStyles, LeftAlignedRow } from '../styles.js'
import type { StepComponentOutputColumnProps } from './StepOutputColumn.types.js'

export const StepOutputColumn: React.FC<StepComponentOutputColumnProps> = memo(
	function StepOutputColumn({ label, step, onChange }) {
		const handleToChange = useTextFieldChangeHandler<OutputColumnArgs>(
			step as Step<OutputColumnArgs>,
			(s, val) => (s.args.to = val as string),
			onChange,
		)
		if (!isOutputColumnStep(step)) {
			return null
		}
		return (
			<LeftAlignedRow>
				<TextField
					required
					label={label || 'New column name'}
					placeholder={'Column name'}
					value={(step.args as OutputColumnArgs).to}
					styles={dropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
		)
	},
)
