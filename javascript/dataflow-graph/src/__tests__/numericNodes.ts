/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeImpl } from '../NodeImpl.js'
import { NodeState } from '../types.js'

export enum Socket {
	LHS = 'lhs',
	RHS = 'rhs',
}
export class ValueNode extends NodeImpl<number, number> {
	constructor(value: number) {
		super([])
		this.data = value
		this.state = NodeState.Hydrated
	}

	protected performRecalculation(): void {
		if (this.config != null) {
			this.data = this.config
		}
	}
}

abstract class ComputeNode extends NodeImpl<number, void> {
	constructor() {
		super([Socket.LHS, Socket.RHS])
	}

	protected performRecalculation(): void {
		const lhs = this.sockets.get(Socket.LHS)
		const rhs = this.sockets.get(Socket.RHS)
		if (lhs == null || rhs == null) {
			this.state = NodeState.Unconfigured
			this.data = undefined
		} else {
			const lhsData = lhs.data
			const rhsData = rhs.data
			if (lhsData == null || rhsData == null) {
				this.state = NodeState.Ready
				this.data = undefined
			} else {
				this.state = NodeState.Hydrated
				this.data = this.compute(lhsData, rhsData)
			}
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
