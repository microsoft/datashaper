/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Maybe } from '../../primitives.js'
import type { Resource } from '../Resource.js'

/**
 * A data emitter for a type of output
 */
export interface Emitter<T> extends Resource {
	/**
	 * The output value stream
	 */
	readonly output$: Observable<Maybe<T>>
	/**
	 * The current output value
	 */
	readonly output: Maybe<T>
}
