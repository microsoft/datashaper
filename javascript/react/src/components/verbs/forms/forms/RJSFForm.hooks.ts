/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'

import capitalize from 'lodash-es/capitalize.js'
import get from 'lodash-es/get.js'
import { COLUMN_ARGS, EXCLUDE_PROPERTIES, FIXED_ENUM_TITLES, FIXED_LABELS } from './RJSFForm.constants.js'
import { useColumnNames, useStepInputTable } from '../../../../hooks/index.js'
import { Step, Workflow } from '@datashaper/workflow'
import { StepChangeFunction } from '../../../../types.js'

/**
 * Fetches and resolves the latest workflow schema for extracting step form args.
 * @returns 
 */
export function useWorkflowSchema() {
	const [schema, setSchema] = useState<any>()
	useEffect(() => {
		fetch(
			'http://localhost:8080/schema/workflow/workflow.json',
		)
			.then((res) => res.json())
			.then(resolve)
			.then(setSchema)
	}, [])
	return schema
}


// TODO: does this need to be recursive?
// TODO RJSF claims to do resolution: https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/definitions
// TODO: how to deal with subobjects? (e.g., Criteria on `binarize`)
function resolve(schema: any) {
	Object.entries(schema.definitions).forEach(
		([defKey, definition]: [string, any]) => {
			if (definition.properties) {
				Object.entries(definition.properties).forEach(
					([propKey, property]: [string, any]) => {
						if (property.$ref) {
							const path = property.$ref
								.replace('#/', '')
								.replaceAll('/', '.')
							schema.definitions[defKey].properties[propKey] = get(
								schema,
								path,
							)
						}
					},
				)
			}
		},
	)
	return schema
}

/**
 * Extracts specific verb args from the workflow schema.
 * This does a little bit of massaging for missing functionality:
 * - avoids certain properties that are managed by HOCs elsewhere (e.g., input columns).
 * - uses some pre-defined labels for certain properties to read better.
 * - formats enums in a jsonschema-standard way for rendering as dropdowns. 
 * @param step 
 * @param schema 
 * @returns 
 */
export function useVerbArgsSchema(step: any, schema: any) {
	return useMemo(() => {
		if (step && schema) {
			const verb = capitalize(step.verb)
			const args = schema.definitions[`${verb}Args`]
			if (!args) {
				return undefined
			}
			const properties = Object.entries(args.properties).reduce(
				(acc: any, [key, value]: [any, any]) => {
					if (!EXCLUDE_PROPERTIES.has(key)) {
						acc[key] = {
							title: FIXED_LABELS[key] || capitalize(key),
							type: value.type || 'string', // this covers "any", which translates to _no type_ in jsonschema
						}
						if (value.enum) {
							acc[key].oneOf = prettyEnum(value.enum, true)
						}
					}
					return acc
				},
				{} as any,
			)
			return {
				...args,
				properties,
			}
		}
	}, [step, schema])
}

// TODO: can we get our jsonschema generator to create the official oneOf format and use the TS names?
// https://github.com/rjsf-team/react-jsonschema-form/pull/581
function prettyEnum(
	values: string[],
	format = false,
): {
	enum: string[]
	title: string
}[] {
	return values.map((v) => {
		// we don't format column names, since they should stay as-is
		// also not that this formatting differs from how we split enum keys; we should do a better regex for prettier acronyms
		const title =
			FIXED_ENUM_TITLES[v] || format ? capitalize(v.replaceAll('_', ' ')) : v
		return {
			enum: [v],
			title,
		}
	})
}

/**
 * Binds any special verb args properties to data from the workflow.
 * @param args 
 * @param step 
 * @param workflow 
 * @returns 
 */
export function useDataBoundArgsSchema(args: any, step: Step, workflow: Workflow | undefined) {
	const dataTable = useStepInputTable(step, workflow)
	const columns = useColumnNames(dataTable)
	return useMemo(() => {
		if (args && columns) {
			const copy = { ...args }
			COLUMN_ARGS.forEach((column) => {
				if (copy.properties[column]) {
					copy.properties[column].oneOf = prettyEnum(columns, false)
				}
			})
			return copy
		}
		return args
	}, [args, columns])
}


export function useOnFormChange(step: Step, onChange?: StepChangeFunction) {
	return useCallback(
		(data: any) => {
			// rjsf gives back the entire props on change - just pluck the formData, which are the step args
			onChange?.({
				...step,
				args: data.formData,
			})
		},
		[step, onChange],
	)
}