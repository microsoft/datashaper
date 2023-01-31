/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ResourceSchema } from '@datashaper/schema'

export type Readable<T extends ResourceSchema> = {
	profile?: T['profile'] | undefined
	name?: T['name'] | undefined
} & Omit<T, 'profile' | 'name' | '$schema'>
