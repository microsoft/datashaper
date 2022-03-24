/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeId } from '../../graph/index.js'
import { BaseNode } from '../../graph/index.js'
import { container } from '../../tables/container.js'
import type { TableContainer } from '../../tables/types.js'
import { handleMaybeAsync } from '../util/handleMaybeAsync.js'
import type { InputStep } from './types.js'

export class InputNode<Args> extends BaseNode<TableContainer, Args> {
	constructor(id: NodeId, private _computeFn: InputStep<Args>) {
		super()
		this.id = id
	}
	protected doRecalculate(): void | Promise<void> {
		if (this.config != null) {
			const output = this._computeFn(this.config)
			return handleMaybeAsync(output, t => this.emit(container(this.id, t)))
		} else {
			this.emit(undefined)
		}
	}
}

export function makeInputNode<Args>(
	compute: InputStep<Args>,
): (id: string) => InputNode<Args> {
	return (id: string) => new InputNode(id, compute)
}
