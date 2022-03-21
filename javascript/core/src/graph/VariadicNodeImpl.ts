/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import { NodeImpl } from './NodeImpl.js'
import type { Maybe } from './types.js'

const VARIADIC_PREFIX = 'DWC.VariadicInput.'

function isVariadicInput(name: string): boolean {
	return name.startsWith(VARIADIC_PREFIX)
}

export abstract class VariadicNodeImpl<T, Config> extends NodeImpl<T, Config> {
	private variadicIndex = 0

	public constructor(inputs: string[] = [], outputs: string[] = []) {
		super(inputs, outputs)
	}

	/**
	 * Get the next input name
	 * @returns The next variadic input name
	 */
	public nextInput(): string {
		return `${VARIADIC_PREFIX}${this.variadicIndex++}`
	}

	public installNext(socket: Observable<Maybe<T>>): string {
		const name = this.nextInput()
		this.install(name, socket)
		return name
	}

	protected override verifyInputSocketName(name: string): void {
		if (!isVariadicInput(name)) {
			return super.verifyInputSocketName(name)
		}
	}

	protected getVariadicInputValues(): Maybe<T>[] {
		const result: Maybe<T>[] = []
		this.inputValues.forEach((value, name) => {
			if (isVariadicInput(name)) {
				result.push(value)
			}
		})
		return result
	}
}
