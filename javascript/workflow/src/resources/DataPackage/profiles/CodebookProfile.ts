import { CodebookSchema, KnownProfile, Profile } from '@datashaper/schema'
import { Codebook } from '../../Codebook.js'
import type { Resource } from '../../Resource.js'
import type { ProfileHandler } from '../../types.js'

export class CodebookProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.Codebook

	public async createInstance(
		schema: CodebookSchema | undefined,
	): Promise<Resource> {
		return new Codebook(schema)
	}
}
