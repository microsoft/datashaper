/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import Form from '@rjsf/fluent-ui'
import validator from '@rjsf/validator-ajv8'
import type { StepFormProps } from '../types.js'

import './rjsf.css'
import {
	useDataBoundArgsSchema,
	useOnFormChange,
	useVerbArgsSchema,
} from './RJSFForm.hooks.js'
import { UI_SCHEMA_DEFAULTS } from './RJSFForm.constants.js'

/**
 * Encapsulates standard handling for generated UX using RJSF with our verbs and fluent.
 */
export const RJSFForm: React.FC<StepFormProps> = memo(function RJSFForm({
	schema,
	step,
	workflow,
	onChange,
}) {
	
	const args = useVerbArgsSchema(step, schema)
	const finalSchema = useDataBoundArgsSchema(args, step, workflow)

	const handleChange = useOnFormChange(step, onChange)

	console.log(step.verb, finalSchema)
	if (!finalSchema) {
		return null
	}

	return (
		<Form
			className='rjsf-root'
			uiSchema={UI_SCHEMA_DEFAULTS}
			schema={finalSchema}
			validator={validator}
			formData={step.args}
			onChange={handleChange}
		/>
	)
})
