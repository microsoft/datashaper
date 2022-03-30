/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '../primitives.js'
import { BaseNode } from './BaseNode.js'
import { DefaultBoundInput } from './BoundInput.js'
import type { NodeBinding, SocketName } from './types.js'

export abstract class BaseVariadicNode<T, Config> extends BaseNode<T, Config> {
	private _disposeVariadicInputs: Maybe<() => void>
	private _getVariadicInputs: Maybe<() => Maybe<T>[]>

	public constructor(inputs: SocketName[] = [], outputs: SocketName[] = []) {
		super(inputs, outputs)
	}

	public override bindVariadic(inputs: Omit<NodeBinding<T>, 'input'>[]): void {
		// unsubcribe to old variadic inputs
		if (this._disposeVariadicInputs) {
			this._disposeVariadicInputs()
		}

		const boundInputs = inputs.map(i => {
			const bi = new DefaultBoundInput(i)
			bi.onValueChange(() => this.recalculate())
			return bi
		})
		this._disposeVariadicInputs = () => boundInputs.forEach(bi => bi.dispose())
		this._getVariadicInputs = () => boundInputs.map(bi => bi.current)
		this.recalculate()
	}

	protected getVariadicInputValues(): Maybe<T>[] {
		return this._getVariadicInputs ? this._getVariadicInputs() : []
	}
}
