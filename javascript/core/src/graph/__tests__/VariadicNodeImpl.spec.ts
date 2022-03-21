import { ValueNode, VariadicAddNode } from './numericNodes.js'

describe('NodeImpl', () => {
	it('can perform a variadic operation', () => {
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		const sum = new VariadicAddNode()
		expect(sum.outputValue()).toBe(0)
		const n1 = sum.installNext(two.output())
		expect(sum.outputValue()).toBe(2)
		const n2 = sum.installNext(three.output())
		expect(sum.outputValue()).toBe(5)
		const n3 = sum.installNext(three.output())
		expect(sum.outputValue()).toBe(8)

		sum.uninstall(n3)
		expect(sum.outputValue()).toBe(5)
		sum.uninstall(n2)
		expect(sum.outputValue()).toBe(2)
		sum.uninstall(n1)
		expect(sum.outputValue()).toBe(0)
	})
})
