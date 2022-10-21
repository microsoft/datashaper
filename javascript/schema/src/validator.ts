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
