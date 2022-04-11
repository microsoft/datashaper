import { ValueNode, VariadicAddNode } from './numericNodes.js'

describe('VariadicNode', () => {
	it('can perform a variadic operation', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new VariadicAddNode()
		expect(sum.outputValue()).toBe(0)
		sum.bindVariadic([{ node: two }, { node: three }, { node: three }])
		expect(sum.outputValue()).toBe(8)

		sum.bindVariadic([{ node: two }, { node: three }])
		expect(sum.outputValue()).toBe(5)
		sum.bindVariadic([{ node: two }])
		expect(sum.outputValue()).toBe(2)
		sum.bindVariadic([])
		expect(sum.outputValue()).toBe(0)
	})
})
