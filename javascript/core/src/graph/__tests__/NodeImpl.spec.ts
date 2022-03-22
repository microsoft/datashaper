import {
	AddNode,
	DivideNode,
	Input,
	MultiplyNode,
	SubtractNode,
	ThrowingNode,
	ValueNode,
} from './numericNodes.js'

describe('NodeImpl', () => {
	it('will throw an error if installing unknown input socket', () => {
		const two = new ValueNode(2)
		const sum = new AddNode()
		expect(() => sum.bind('derp', { node: two })).toThrow(
			/unknown input socket name "derp"/,
		)
	})

	it('will throw an error if uninstalling an unknown input socket', () => {
		const sum = new AddNode()
		expect(() => sum.unbind('derp')).toThrow(/unknown input socket name "derp"/)
	})

	it('will throw an error if uninstalling an ininitialized input socket', () => {
		const sum = new AddNode()
		expect(() => sum.unbind(Input.LHS)).toThrow(/no socket installed at "lhs"/)
	})

	it('will throw an error when retriving an unknown output socket', () => {
		const two = new ValueNode(2)
		expect(() => two.output('derp')).toThrow(
			/unknown output socket name "derp"/,
		)
	})

	it('can define a value node', () => {
		const two = new ValueNode(2)
		let value = null
		two.output().subscribe(v => {
			value = v
		})
		expect(value).toBe(2)
	})

	it('can define a basic mathematical expression', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new AddNode()
		expect(sum.outputValue()).toBeUndefined()
		sum.bind(Input.LHS, { node: two })
		sum.bind(Input.RHS, { node: three })
		expect(sum.outputValue()).toBe(5)
	})

	it('can rewire an expression', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.bind(Input.LHS, { node: two })
		sum.bind(Input.RHS, { node: three })
		expect(sum.outputValue()).toBe(5)

		sum.bind(Input.LHS, { node: three })
		expect(sum.outputValue()).toBe(6)
	})

	it('can define a nested mathematical expression', () => {
		const one = new ValueNode(1)
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		sum.bind(Input.LHS, { node: two })
		sum.bind(Input.RHS, { node: three })

		const subtraction = new SubtractNode()
		subtraction.bind(Input.LHS, { node: sum })
		subtraction.bind(Input.RHS, { node: one })

		expect(subtraction.outputValue()).toBe(4)

		const mult = new MultiplyNode()
		mult.bind(Input.LHS, { node: subtraction })
		mult.bind(Input.RHS, { node: two })
		expect(mult.outputValue()).toBe(8)

		const div = new DivideNode()
		div.bind(Input.LHS, { node: mult })
		div.bind(Input.RHS, { node: two })
		expect(div.outputValue()).toBe(4)
	})

	it('can react to value changes', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.bind(Input.LHS, { node: two })
		sum.bind(Input.RHS, { node: three })
		expect(sum.outputValue()).toBe(5)

		// trigger a config-based recompute
		two.config = 3
		expect(sum.outputValue()).toBe(6)
	})

	it('will emit errors when recalculate throws', () => {
		const zero = new ValueNode(0)
		const two = new ValueNode(2)
		const div = new ThrowingNode()
		div.bind(Input.LHS, { node: two })
		div.bind(Input.RHS, { node: zero })

		let caught: Error | undefined
		div.output().subscribe({
			next: value => {
				console.log("shouldn't get here", value)
			},
			error: (e: Error) => {
				caught = e
			},
		})
		expect(caught).toBeDefined()
		expect(caught?.message).toBe("I'm a bad node")
	})
})
