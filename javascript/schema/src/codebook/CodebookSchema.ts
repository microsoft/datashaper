/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { KnownProfile } from '../Profile.js'
import type { Field } from './Field.js'

/**
 * This contains all of the field-level details for interpreting a dataset,
 * including data types, mapping, and metadata.
 * Note that with persisted metadata and field examples, a dataset can often be visualized
 * and described to the user without actually loading the source file.
 * resource profile: 'codebook'
 */
export interface CodebookSchema extends ResourceSchema {
	profile: KnownProfile.Codebook

	/**
	 * The per-field encodings. These contain interpretive information about the data.
	 */
	fields: Field[]
}
