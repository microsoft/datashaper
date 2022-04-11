/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseNode } from '../index.js'
import { handleMaybeAsync } from '../primitives.js'

export type InputStep<T, Config> = (args: Config, id: string) => Promise<T> | T

export class InputNode<T, Config> extends BaseNode<T, Config> {
	constructor(private _computeFn: InputStep<T, Config>) {
		super()
	}

	protected doRecalculate(): void | Promise<void> {
		if (this.config != null) {
			const output = this._computeFn(this.config, this.id)
			return handleMaybeAsync(output, this.emit)
		} else {
			this.emit(undefined)
		}
	}
}

export function inputNodeFactory<T, Args>(
	compute: InputStep<T, Args>,
): (id: string) => InputNode<T, Args> {
	return (id: string) => {
		const result = new InputNode<T, Args>(compute)
		result.id = id
		return result
	}
}
