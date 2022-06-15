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
	private static async init(): Promise<void> {
		this.ajv = new Ajv({
			strict: true,
			strictSchema: true,
			strictTypes: true,
			strictRequired: true,
			validateSchema: true,
		})
		this.schema = await getSchema()
		this.ajv.addSchema(this.schema, 'workflowJson')
	}

	static async isValid(worfklowJson?: WorfklowJson): Promise<boolean> {
		if (!this.schema) {
			await this.init()
		}
		const validate = this.ajv.getSchema('workflowJson')
		return !!validate?.(worfklowJson)
	}
}
