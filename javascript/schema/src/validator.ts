/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AnySchema } from 'ajv'
import Ajv from 'ajv'

import type { WorfklowJson } from './schema.js'

async function getSchema() {
	/* eslint-disable @essex/extensions */
	return import('./workflow.json').then(res => (res as any)?.default ?? {})
}

export class WorkflowSchema {
	private static schema: AnySchema
	private static ajv: Ajv

	constructor() {
		this.init()
	}

	private async init(): Promise<void> {
		if (!WorkflowSchema.ajv || !WorkflowSchema.schema) {
			WorkflowSchema.ajv = new Ajv({
				strict: true,
				strictSchema: true,
				strictTypes: true,
				strictRequired: true,
				validateSchema: true,
			})
			WorkflowSchema.schema = await getSchema()
			WorkflowSchema.ajv.addSchema(WorkflowSchema.schema, 'workflowJson')
		}
	}

	isValid(worfklowJson?: WorfklowJson): boolean {
		const validate = WorkflowSchema.ajv.getSchema('workflowJson')
		return !!validate?.(worfklowJson)
	}
}
