/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo, useEffect } from 'react'

import { useTextFieldChangeHandler } from '../hooks/index.js'
import { dropdownStyles } from '../styles.js'
import type { StepComponentOutputTableProps } from './StepComponentOutputTable.types.js'

export const StepComponentOutputTable: React.FC<StepComponentOutputTableProps> =
	memo(function StepComponentOutputTable({
		label,
		disabled,
		output,
		step,
		onChange,
		onChangeOutput,
	}) {
		const handleOutputChange = useTextFieldChangeHandler(
			step,
			(_s, val) => onChangeOutput(val as string),
			onChange,
		)

		useEffect(
			function useDefaultOutputNameInitially() {
				onChangeOutput(output ?? step.id)
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[
				/* only on initial render */
			],
		)

		return (
			<TextField
				required
				disabled={disabled}
				label={label || 'Output table'}
				placeholder={'Table name'}
				value={output ?? step.id}
				styles={dropdownStyles}
				onChange={handleOutputChange}
			/>
		)
	})
