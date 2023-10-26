import { DefaultGraph } from '../DefaultGraph.js'
import { AddNode, Input, ValueNode } from '../nodes/__tests__/numericNodes.js'

describe('DefaultGraph', () => {
	it('can register simple nodes', () => {
		const graph = new DefaultGraph<number>()
		const two = new ValueNode(2)
		graph.add(two)
		expect(graph.nodes).toContain(two.id)
		graph.validate()
	})

	it('can register nodes that are bound to nodes already added to the graph', () => {
		const graph = new DefaultGraph<number>()
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		// add before bind
		const add = new AddNode()
		graph.add(add)
		add.bind({ input: Input.LHS, node: two })
		add.bind({ input: Input.RHS, node: three })

		expect(graph.nodes).toContain(add.id)
		expect(graph.nodes).toContain(two.id)
		expect(graph.nodes).toContain(three.id)
		graph.validate()
	})

	it('can register nodes already bound to nodes being registered', () => {
		const graph = new DefaultGraph<number>()
		const two = new ValueNode(2)
		const three = new ValueNode(3)

		// add before bind
		const add = new AddNode()
		add.bind({ input: Input.LHS, node: two })
		add.bind({ input: Input.RHS, node: three })
		graph.add(add)

		expect(graph.nodes).toContain(add.id)
		expect(graph.nodes).toContain(two.id)
		expect(graph.nodes).toContain(three.id)
		graph.validate()
	})

	it('can detect cycles', () => {
		const graph = new DefaultGraph<number>()

		// add before bind
		const add = new AddNode()
		const two = new ValueNode(2)
		add.bind({ input: Input.LHS, node: two })
		add.bind({ input: Input.RHS, node: add })
		graph.add(add)

		expect(graph.nodes).toContain(add.id)
		expect(() => graph.validate()).toThrow()
	})

	it('can remove nodes', () => {
		const graph = new DefaultGraph<number>()

		// add before bind
		const add = new AddNode()
		const two = new ValueNode(2)
		add.bind({ input: Input.LHS, node: two })
		add.bind({ input: Input.RHS, node: two })
		graph.add(add)

		const add2 = new AddNode()
		add2.bind({ input: Input.LHS, node: two })
		add2.bind({ input: Input.RHS, node: two })
		graph.add(add2)

		graph.remove(two.id)
		expect(graph.nodes).not.toContain(two.id)
	})
})
