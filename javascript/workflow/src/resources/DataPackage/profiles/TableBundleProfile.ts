import { KnownProfile, Profile, TableBundleSchema } from '@datashaper/schema'
import type { Resource } from '../../Resource.js'
import { TableBundle } from '../../TableBundle.js'
import type { ProfileHandler } from '../../types.js'

export class TableBundleProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.TableBundle

	public async createInstance(schema?: TableBundleSchema): Promise<Resource> {
		return new TableBundle(schema)
	}
}
