/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@data-wrangling-components/core'
import Ajv from 'ajv'

import type { WorfklowJson } from './schema.js'

async function getSchema() {
	/* eslint-disable @essex/extensions */
	return import('./workflow.json').then(res => (res as any)?.default ?? {})
}

export async function schemaValidator(
	worfklowJson?: WorfklowJson,
): Promise<Maybe<boolean>> {
	if (!worfklowJson) {
		return
	}
	const schema = await getSchema()
	const ajv = new Ajv({
		strict: true,
		strictSchema: true,
		strictTypes: true,
		strictRequired: true,
		validateSchema: true,
	})
	const validateJson = ajv.compile(schema)

	return validateJson(worfklowJson)
}
