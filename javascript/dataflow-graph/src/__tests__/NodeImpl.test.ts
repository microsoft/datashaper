import {
	AddNode,
	DivideNode,
	Input,
	MultiplyNode,
	SubtractNode,
	ValueNode,
} from './numericNodes.js'

describe('The Node implementation', () => {
	it('can define a value node', () => {
		const two = new ValueNode(2)
		let value = null
		two.output().subscribe(v => {
			value = v
		})
		expect(value).toBe(2)
	})
	it('can define a basic mathematical expression', async () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new AddNode()
		expect(sum.outputValue()).toBeUndefined()
		sum.install(Input.LHS, two.output())
		sum.install(Input.RHS, three.output())
		expect(sum.outputValue()).toBe(5)
	})

	it('can define a nested mathematical expression', () => {
		const one = new ValueNode(1)
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		sum.install(Input.LHS, two.output())
		sum.install(Input.RHS, three.output())

		const subtraction = new SubtractNode()
		subtraction.install(Input.LHS, sum.output())
		subtraction.install(Input.RHS, one.output())

		expect(subtraction.outputValue()).toBe(4)

		const mult = new MultiplyNode()
		mult.install(Input.LHS, subtraction.output())
		mult.install(Input.RHS, two.output())
		expect(mult.outputValue()).toBe(8)

		const div = new DivideNode()
		div.install(Input.LHS, mult.output())
		div.install(Input.RHS, two.output())
		expect(div.outputValue()).toBe(4)
	})

	it('can react to value changes', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.install(Input.LHS, two.output())
		sum.install(Input.RHS, three.output())
		expect(sum.outputValue()).toBe(5)

		// trigger a config-based recompute
		two.config = 3
		expect(sum.outputValue()).toBe(6)
	})
})
