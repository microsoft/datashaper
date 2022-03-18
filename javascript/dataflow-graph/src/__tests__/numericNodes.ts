/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeImpl } from '../NodeImpl.js'

export enum Input {
	LHS = 'lhs',
	RHS = 'rhs',
}
export enum Output {
	Result = 'val',
}
export class ValueNode extends NodeImpl<number, number> {
	constructor(value: number) {
		super([], [Output.Result])
		this.emit(Output.Result, value)
	}

	protected doRecalculate(): void {
		if (this.config != null) {
			this.emit(Output.Result, this.config)
		}
	}
}

abstract class ComputeNode extends NodeImpl<number, void> {
	constructor() {
		super([Input.LHS, Input.RHS], [Output.Result])
	}

	protected doRecalculate(): void {
		const lhs = this.inputValue(Input.LHS)
		const rhs = this.inputValue(Input.RHS)
		if (lhs != null && rhs != null) {
			this.emit(Output.Result, this.compute(lhs, rhs))
		} else {
			this.emit(Output.Result, undefined)
		}
	}

	protected abstract compute(lhs: number, rhs: number): number
}

export class AddNode extends ComputeNode {
	protected compute(lhs: number, rhs: number): number {
		return lhs + rhs
	}
}
export class SubtractNode extends ComputeNode {
	protected compute(lhs: number, rhs: number): number {
		return lhs - rhs
	}
}
export class MultiplyNode extends ComputeNode {
	protected compute(lhs: number, rhs: number): number {
		return lhs * rhs
	}
}
export class DivideNode extends ComputeNode {
	protected compute(lhs: number, rhs: number): number {
		return lhs / rhs
	}
}
