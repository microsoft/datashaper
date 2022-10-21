/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Ajv from 'ajv'

export function createSchemaValidator(): Ajv {
	return new Ajv({
		strict: true,
		strictSchema: true,
		strictTypes: true,
		strictRequired: true,
		validateSchema: true,
		allowUnionTypes: true,
	}).addFormat('date-time', true)
}
