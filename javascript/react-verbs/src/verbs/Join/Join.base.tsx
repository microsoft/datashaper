/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { JoinStrategy } from '@data-wrangling-components/core'
import { useSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { VerbForm } from '../../common/VerbForm.js'
import {
	dropdown,
	enumDropdown,
	joinInputs,
} from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '../../types.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinBase: React.FC<
	StepComponentBaseProps<JoinArgs> & {
		tables: string[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function JoinBase({
	step,
	onChange,
	tables,
	leftColumns,
	rightColumns,
}) {
	const tableOptions = useSimpleDropdownOptions(tables)
	const inputs = useMemo<FormInput<JoinArgs>[]>(
		() => [
			dropdown(
				'Join table',
				tables,
				step.input[NodeInput.Other]?.node,
				(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
			),
			enumDropdown(
				'Join strategy',
				JoinStrategy,
				step.args.strategy,
				(s, val) => (s.args.strategy = val as JoinStrategy),
			),
			...joinInputs(step, leftColumns, rightColumns),
		],
		[step, tableOptions, leftColumns, rightColumns, tables],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})
