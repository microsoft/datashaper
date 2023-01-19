/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseNode } from '../BaseNode.js'

export enum Input {
	LHS = 'lhs',
	RHS = 'rhs',
}

export class ValueNode extends BaseNode<number, number> {
	constructor(value: number) {
		super()
		this.emit(value)
	}

	protected doRecalculate(): void {
		if (this.config != null) {
			this.emit(this.config)
		}
	}
}

abstract class ComputeNode extends BaseNode<number, void> {
	constructor() {
		super([Input.LHS, Input.RHS])
	}

	protected doRecalculate(): void {
		const lhs = this.inputValue(Input.LHS)
		const rhs = this.inputValue(Input.RHS)
		if (lhs != null && rhs != null) {
			this.emit(this.compute(lhs, rhs))
		} else {
			this.emit(undefined)
		}
	}

	protected abstract compute(lhs: number, rhs: number): number
}

abstract class VariadicComputeNode extends BaseNode<number, void> {
	constructor() {
		super()
		this.emit(0)
	}
	protected doRecalculate(): void {
		const inputs = this.getVariadicInputValues().filter(
			(i) => i != null,
		) as number[]
		this.emit(this.compute(inputs))
	}

	protected abstract compute(inputs: number[]): number
}

export class AddNode extends ComputeNode {
	protected compute(lhs: number, rhs: number): number {
		return lhs + rhs
	}
}
export class VariadicAddNode extends VariadicComputeNode {
	protected compute(args: number[]): number {
		return args.reduce((a, b) => a + b, 0)
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
export class ThrowingNode extends ComputeNode {
	protected compute(): number {
		throw new Error("I'm a bad node")
	}
}
