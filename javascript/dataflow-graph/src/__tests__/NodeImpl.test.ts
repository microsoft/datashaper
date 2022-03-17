import { NodeState } from '../types.js'
import {
	AddNode,
	DivideNode,
	MultiplyNode,
	Socket,
	SubtractNode,
	ValueNode,
} from './numericNodes.js'

describe('The Node implementation', () => {
	it('can define a basic mathematical expression', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		expect(sum.state).toEqual(NodeState.Unconfigured)
		expect(sum.data).toBeUndefined()

		sum.install(Socket.LHS, two)
		expect(sum.state).toEqual(NodeState.Unconfigured)
		expect(sum.data).toBeUndefined()

		sum.install(Socket.RHS, three)
		expect(sum.state).toEqual(NodeState.Hydrated)
		expect(sum.data).toBe(5)
	})

	it('can define a nested mathematical expression', () => {
		const one = new ValueNode(1)
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		sum.install(Socket.LHS, two)
		sum.install(Socket.RHS, three)

		const subtraction = new SubtractNode()
		subtraction.install(Socket.LHS, sum)
		subtraction.install(Socket.RHS, one)

		expect(subtraction.state).toEqual(NodeState.Hydrated)
		expect(subtraction.data).toBe(4)

		const mult = new MultiplyNode()
		mult.install(Socket.LHS, subtraction)
		mult.install(Socket.RHS, two)
		expect(mult.data).toBe(8)

		const div = new DivideNode()
		div.install(Socket.LHS, mult)
		div.install(Socket.RHS, two)
		expect(div.data).toBe(4)
	})

	it('can react to value changes', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.install(Socket.LHS, two)
		sum.install(Socket.RHS, three)
		expect(sum.data).toBe(5)

		two.configure(3)
		expect(sum.data).toBe(6)
	})
})
