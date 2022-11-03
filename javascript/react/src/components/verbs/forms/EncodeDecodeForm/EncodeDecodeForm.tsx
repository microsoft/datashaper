/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeDecodeArgs } from '@datashaper/schema'
import { memo, useEffect } from 'react'

import type { StepFormProps } from '../types.js'
import { EncodeDecodeFormBase } from './EncodeDecodeForm.base.js'
import { useCodebookContent } from './EncodeDecodeForm.hooks.js'

/*
 *
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EncodeDecodeForm: React.FC<StepFormProps<EncodeDecodeArgs>> = memo(
	function EncodeDecodeForm({ step, onChange, metadata }) {
		const codebook = useCodebookContent(metadata)

		useEffect(() => {
			if (metadata != null && onChange != null) {
				if (step.args.codebook == null && codebook != null) {
					onChange({
						...step,
						args: {
							...step.args,
							codebook: codebook,
						},
					})
				}
			}
		}, [metadata, onChange, step, codebook])

		return <EncodeDecodeFormBase step={step} onChange={onChange} />
	},
)
