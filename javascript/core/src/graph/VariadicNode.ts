/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '../primitives.js'
import { BaseNode } from './BaseNode.js'
import type { NodeBinding, SocketName } from './types.js'

const VARIADIC_PREFIX = 'DWC.VariadicInput.'

function isVariadicInput(name: string): boolean {
	return name.startsWith(VARIADIC_PREFIX)
}

export abstract class VariadicNodeImpl<T, Config> extends BaseNode<T, Config> {
	private variadicIndex = 0

	public constructor(inputs: SocketName[] = [], outputs: SocketName[] = []) {
		super(inputs, outputs)
	}

	/**
	 * Get the next input name
	 * @returns The next variadic input name
	 */
	protected nextInput(): SocketName {
		return `${VARIADIC_PREFIX}${this.variadicIndex++}`
	}

	public installNext(binding: Omit<NodeBinding<T>, 'input'>): SocketName {
		const input = this.nextInput()
		this.bind({ ...binding, input })
		return input
	}

	protected override verifyInputSocketName(name: SocketName): void {
		if (!isVariadicInput(String(name))) {
			return super.verifyInputSocketName(name)
		}
	}

	protected getVariadicInputValues(): Maybe<T>[] {
		const result: Maybe<T>[] = []
		const inputs = this.getInputValues()
		Object.keys(inputs).forEach(name => {
			const value = inputs[name]
			if (isVariadicInput(name)) {
				result.push(value)
			}
		})
		return result
	}
}
