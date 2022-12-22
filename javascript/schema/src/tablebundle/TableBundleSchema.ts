/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { KnownProfile } from '../enums/index.js'

/**
 * A table bundle encapsulates table-specific resources into a single resource with a
 * prescribed workflow.
 *
 * A tablebundle requires a `source` entry with rel="input" for the source table.
 * A tablebundle may also include `source` entries with rel="codebook" and rel="workflow"
 * for interpretation and processing of the source data table.
 */
export interface TableBundleSchema extends ResourceSchema {
	profile: KnownProfile.TableBundle
}
