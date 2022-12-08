/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import { createSchemaValidator } from '@datashaper/schema'

import { fetchJson } from '../../util/network.js'

export class WorkflowSchemaValidator {
	private static readonly validator = createSchemaValidator()

	public static async validate(workflowJson: WorkflowSchema): Promise<boolean> {
		const validator = WorkflowSchemaValidator.validator
		const { $schema } = workflowJson || {}
		if ($schema == null) {
			console.warn('No $schema property found in workflow JSON')
			return true
		}

		if (!validator.schemas[$schema]) {
			const schemaJson = await fetchJson($schema)
			validator.addSchema(schemaJson, $schema)
		}
		const validate = validator.getSchema($schema)
		return !!validate?.(workflowJson)
	}
}
