/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-ignore */
import type Ajv from 'ajv'
import { createRequire } from 'module'

import { createSchemaValidator } from '../validator.js'
const require = createRequire(import.meta.url)

const CODEBOOK_SCHEMA_PATH = '../../../../schema/codebook.json'
const DATAPACKAGE_SCHEMA_PATH = '../../../../schema/datapackage.json'
const DATATABLE_SCHEMA_PATH = '../../../../schema/datatable.json'
const WORKFLOW_SCHEMA_PATH = '../../../../schema/workflow.json'

describe('Generated JSON Schemas', () => {
	const validator: Ajv = createSchemaValidator()

	it('codebook schema can be validated', () => {
		expect(validator.compile(require(CODEBOOK_SCHEMA_PATH))).toBeDefined()
	})

	it('datapackage schema can be validated', () => {
		expect(validator.compile(require(DATAPACKAGE_SCHEMA_PATH))).toBeDefined()
	})

	it('datatable schema can be validated', () => {
		expect(validator.compile(require(DATATABLE_SCHEMA_PATH))).toBeDefined()
	})

	it('workflow schema can be validated', () => {
		expect(validator.compile(require(WORKFLOW_SCHEMA_PATH))).toBeDefined()
	})
})
