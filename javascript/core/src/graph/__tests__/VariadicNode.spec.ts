import { ValueNode, VariadicAddNode } from './numericNodes.js'

describe('VariadicNode', () => {
	it('can perform a variadic operation', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new VariadicAddNode()
		expect(sum.outputValue()).toBe(0)
		const n1 = sum.bindNext({ node: two })
		expect(sum.outputValue()).toBe(2)
		const n2 = sum.bindNext({ node: three })
		expect(sum.outputValue()).toBe(5)
		const n3 = sum.bindNext({ node: three })
		expect(sum.outputValue()).toBe(8)

		sum.unbind(n3)
		expect(sum.outputValue()).toBe(5)
		sum.unbind(n2)
		expect(sum.outputValue()).toBe(2)
		sum.unbind(n1)
		expect(sum.outputValue()).toBe(0)
	})
})
