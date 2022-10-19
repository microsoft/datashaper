/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '../../primitives.js'
import { DefaultBoundInput } from '../BoundInput.js'
import type { NodeBinding, SocketName } from '../types.js'
import { BaseNode } from './BaseNode.js'

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

		const boundInputs = inputs.map((i, index) => {
			const bi = new DefaultBoundInput(`variadic-${index}`, i)
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
