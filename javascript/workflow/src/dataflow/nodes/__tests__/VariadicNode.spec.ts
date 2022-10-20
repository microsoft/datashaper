import { ValueNode, VariadicAddNode } from './numericNodes.js'

describe('VariadicNode', () => {
	it('can perform a variadic operation', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new VariadicAddNode()
		expect(sum.output()).toBe(0)
		sum.bind([{ node: two }, { node: three }, { node: three }])
		expect(sum.output()).toBe(8)

		sum.bind([{ node: two }, { node: three }])
		expect(sum.output()).toBe(5)
		sum.bind([{ node: two }])
		expect(sum.output()).toBe(2)
		sum.bind([])
		expect(sum.output()).toBe(0)
	})
})
