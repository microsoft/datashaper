import {
	AddNode,
	DivideNode,
	Input,
	MultiplyNode,
	SubtractNode,
	ThrowingNode,
	ValueNode,
} from './numericNodes.js'

describe('BaseNode', () => {
	it('will throw an error if installing unknown input socket', () => {
		const two = new ValueNode(2)
		const sum = new AddNode()
		expect(() => sum.bind({ input: 'derp', node: two })).toThrow(
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
		two.output$().subscribe(v => {
			value = v
		})
		expect(value).toBe(2)
	})

	it('can define a basic mathematical expression', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new AddNode()
		expect(sum.output()).toBeUndefined()
		sum.bind({ input: Input.LHS, node: two })
		sum.bind({ input: Input.RHS, node: three })
		expect(sum.output()).toBe(5)
	})

	it('can rewire an expression', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.bind({ input: Input.LHS, node: two })
		sum.bind({ input: Input.RHS, node: three })
		expect(sum.output()).toBe(5)

		sum.bind({ input: Input.LHS, node: three })
		expect(sum.output()).toBe(6)
	})

	it('can define a nested mathematical expression', () => {
		const one = new ValueNode(1)
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()
		sum.bind({ input: Input.LHS, node: two })
		sum.bind({ input: Input.RHS, node: three })

		const subtraction = new SubtractNode()
		subtraction.bind({ input: Input.LHS, node: sum })
		subtraction.bind({ input: Input.RHS, node: one })

		expect(subtraction.output()).toBe(4)

		const mult = new MultiplyNode()
		mult.bind({ input: Input.LHS, node: subtraction })
		mult.bind({ input: Input.RHS, node: two })
		expect(mult.output()).toBe(8)

		const div = new DivideNode()
		div.bind({ input: Input.LHS, node: mult })
		div.bind({ input: Input.RHS, node: two })
		expect(div.output()).toBe(4)
	})

	it('can react to value changes', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)
		const sum = new AddNode()

		sum.bind({ input: Input.LHS, node: two })
		sum.bind({ input: Input.RHS, node: three })
		expect(sum.output()).toBe(5)

		// trigger a config-based recompute
		two.config = 3
		expect(sum.output()).toBe(6)
	})

	it('will emit errors when recalculate throws', () => {
		const zero = new ValueNode(0)
		const two = new ValueNode(2)
		const div = new ThrowingNode()
		div.bind({ input: Input.LHS, node: two })
		div.bind({ input: Input.RHS, node: zero })

		let caught: Error | undefined
		div.output$().subscribe({
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
