/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Ajv from 'ajv'
import type { WorfklowJson } from './schema.js'

async function getSchema() {
	/* eslint-disable @essex/extensions */
	return import('./workflow.json').then(res => (res as any)?.default ?? {})
}

export class WorkflowSchema {
	private initPromise: Promise<void>
	private ajv = new Ajv({
		strict: true,
		strictSchema: true,
		strictTypes: true,
		strictRequired: true,
		validateSchema: true,
	})

	constructor() {
		this.initPromise = getSchema().then(schema => {
			this.ajv.addSchema(schema, 'workflowJson')
		})
	}

	public async isValid(worfklowJson?: WorfklowJson): Promise<boolean> {
		await this.initPromise
		const validate = this.ajv.getSchema('workflowJson')
		return !!validate?.(worfklowJson)
	}
}
