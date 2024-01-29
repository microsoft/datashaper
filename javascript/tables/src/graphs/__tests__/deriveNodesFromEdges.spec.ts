/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import { fromCSV } from '../../fromCSV.js'
import { deriveNodesFromEdges } from '../deriveNodesFromEdges.js'

describe('graphs', () => {

	const ecsv = fs.readFileSync('./src/graphs/__tests__/data/synthetic_1/edges.csv', {
		encoding: 'utf8',
		flag: 'r',
	})
	const edges = fromCSV(ecsv)

	describe('deriveNodesFromEdges', () => {
		test('normal derive', async () => {
			const nodes = deriveNodesFromEdges(await edges, 'source', 'target')
			// this node count was hand-verified in excel. it does NOT match the nodes table, indicating there are unlinked nodes.
			expect(nodes.numRows()).toBe(7872)
		})
		test('invalid source throws', async () => {
			const edgesTable = await edges
			expect(() => deriveNodesFromEdges(edgesTable, 'src', 'target')).toThrow()
		})
		test('invalid target throws', async () => {
			const edgesTable = await edges
			expect(() => deriveNodesFromEdges(edgesTable, 'source', 'tgt')).toThrow()
		})
		test('default node id === id', async () => {
			const nodes = deriveNodesFromEdges(await edges, 'source', 'target')
			expect(nodes.column('id')).toBeDefined()
		})
		test('node id can be customized', async () => {
			const nodes = deriveNodesFromEdges(await edges, 'source', 'target', 'node')
			expect(nodes.column('node')).toBeDefined()
		})
	})
})
