/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowSchema } from '@datashaper/schema'
import Ajv from 'ajv'

const baseUrl = 'https://microsoft.github.io/datashaper/schema/workflow'
const defaultWorkflow = 'workflow.json'

async function getSchema(version: string) {
	try {
		return await fetch(`${baseUrl}/${version}`).then(res => res.json())
	} catch {
		return await fetch(`${baseUrl}/${defaultWorkflow}`).then(res => res.json())
	}
}

export class WorkflowSchemaValidator {
	private ajv = new Ajv({
		strict: true,
		strictSchema: true,
		strictTypes: true,
		strictRequired: true,
		validateSchema: true,
	})

	public async isValid(workflowJson?: WorkflowSchema): Promise<boolean> {
		const { $schema } = workflowJson || {}
		if (!$schema) {
			console.warn('No $schema property found in workflow JSON')
		}

		const version = $schema?.split('workflow/')?.pop() || defaultWorkflow
		await getSchema(version).then(schema => {
			if (!this.ajv.getSchema(version)) {
				this.ajv.addSchema(schema, version)
			}
		})
		const validate = this.ajv.getSchema(version)
		return !!validate?.(workflowJson)
	}
}

export const WorkflowSchemaInstance = new WorkflowSchemaValidator()
Object.freeze(WorkflowSchemaInstance)
