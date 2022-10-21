/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export function createSchemaValidator(): Ajv {
	const result = new Ajv({
		strict: true,
		strictSchema: true,
		strictTypes: true,
		strictRequired: true,
		validateSchema: true,
		allowUnionTypes: true,
	})
	addFormats(result)
	return result
}
