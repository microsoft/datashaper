import {
	AddNode,
	DivideNode,
	Input,
	MultiplyNode,
	Output,
	SubtractNode,
	ValueNode,
} from './numericNodes.js'

describe('The Node implementation', () => {
	it('can define a value node', () => {
		const two = new ValueNode(2)
		let value = null
		two.output(Output.Result).subscribe(v => {
			value = v
		})
		expect(value).toBe(2)
	})
	it('can define a basic mathematical expression', async () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new AddNode()
		expect(sum.outputValue(Output.Result)).toBeUndefined()
		sum.install(Input.LHS, two.output(Output.Result))
		sum.install(Input.RHS, three.output(Output.Result))
		expect(sum.outputValue(Output.Result)).toBe(5)
	})

	it('can define a nested mathematical expression', () => {
		const one = new ValueNode(1)
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		sum.install(Input.LHS, two.output(Output.Result))
		sum.install(Input.RHS, three.output(Output.Result))

		const subtraction = new SubtractNode()
		subtraction.install(Input.LHS, sum.output(Output.Result))
		subtraction.install(Input.RHS, one.output(Output.Result))

		expect(subtraction.outputValue(Output.Result)).toBe(4)

		const mult = new MultiplyNode()
		mult.install(Input.LHS, subtraction.output(Output.Result))
		mult.install(Input.RHS, two.output(Output.Result))
		expect(mult.outputValue(Output.Result)).toBe(8)

		const div = new DivideNode()
		div.install(Input.LHS, mult.output(Output.Result))
		div.install(Input.RHS, two.output(Output.Result))
		expect(div.outputValue(Output.Result)).toBe(4)
	})

	it('can react to value changes', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.install(Input.LHS, two.output(Output.Result))
		sum.install(Input.RHS, three.output(Output.Result))
		expect(sum.outputValue(Output.Result)).toBe(5)

		// trigger a config-based recompute
		two.config = 3
		expect(sum.outputValue(Output.Result)).toBe(6)
	})
})
