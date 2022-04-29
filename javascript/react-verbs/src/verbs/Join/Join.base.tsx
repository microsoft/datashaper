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
import { FormInputType,VerbForm } from '../../common/VerbForm.js'
import type { StepComponentBaseProps } from '../../types.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinBase: React.FC<
	StepComponentBaseProps<JoinArgs> & { tables: string[] }
> = memo(function JoinBase({ step, onChange, tables }) {
	const tableOptions = useSimpleDropdownOptions(tables)
	const inputs = useMemo<FormInput<JoinArgs>[]>(
		() => [
			{
				label: 'Join table',
				type: FormInputType.SingleChoice,
				options: tableOptions,
				current: step.input[NodeInput.Other]?.node as string,
				onChange: (s, val) =>
					(s.input[NodeInput.Other] = { node: val as string }),
			},
			{
				label: 'Join strategy',
				type: FormInputType.SingleChoice,
				current: step.args.strategy || JoinStrategy.Inner,
				onChange: (s, val) => (s.args.strategy = val as JoinStrategy),
			},
		],
		[step, tableOptions],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})
