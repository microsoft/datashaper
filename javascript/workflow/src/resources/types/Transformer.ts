/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Maybe } from '../../primitives.js'
import type { Emitter } from './Emitter.js'

/**
 * A transformer for a type of I/O
 */
export interface Transformer<I, O = I> extends Emitter<O> {
	/**
	 * A transformer can set input
	 */
	input$: Observable<Maybe<I>> | undefined
}
