import Ajv from 'ajv'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const CODEBOOK_SCHEMA_PATH = '../../../../schema/codebook.json'
const DATAPACKAGE_SCHEMA_PATH = '../../../../schema/datapackage.json'
const DATATABLE_SCHEMA_PATH = '../../../../schema/datatable.json'
const WORKFLOW_SCHEMA_PATH = '../../../../schema/workflow.json'

describe('Generated JSON Schemas', () => {
	let validator: Ajv
	beforeAll(() => {
		validator = new Ajv({
			strict: true,
			strictSchema: true,
			strictTypes: true,
			strictRequired: true,
			validateSchema: true,
			allowUnionTypes: true,
			allowDate: true,
		})
	})

	it('codebook schema can be validated', () => {
		validator.compile(require(CODEBOOK_SCHEMA_PATH))
	})

	it('datapackage schema can be validated', () => {
		validator.compile(require(DATAPACKAGE_SCHEMA_PATH))
	})

	it('datatable schema can be validated', () => {
		validator.compile(require(DATATABLE_SCHEMA_PATH))
	})

	it('workflow schema can be validated', () => {
		validator.compile(require(WORKFLOW_SCHEMA_PATH))
	})
})
