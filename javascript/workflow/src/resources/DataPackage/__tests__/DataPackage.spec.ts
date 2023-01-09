import { Codebook } from '../../Codebook.js'
import { DataPackage } from '../DataPackage.js'
import { toBlob } from '../io.js'

describe('the data package', () => {
	it('can load a basic datapackage object', async () => {
		const dp = new DataPackage()
		await dp.load(
			fileSet({
				'datapackage.json': {
					resources: [
						{
							profile: 'tablebundle',
							name: 'foo',
							sources: [
								{ profile: 'datatable', path: 'foo.csv' },
								{ profile: 'workflow', steps: [] },
							],
						},
					],
				},
			}),
		)

		expect(dp.resources.length).toBe(1)

		const table = dp.resources[0]!
		expect(table.name).toBe('foo')
		expect(table.sources.length).toBe(2)
	})

	it('can load a datapackage object with conflicting implicit names', async () => {
		const dp = new DataPackage()
		await dp.load(
			fileSet({
				'datapackage.json': {
					resources: [
						{
							profile: 'tablebundle',
							name: 'foo',
							sources: [
								{ profile: 'datatable', path: 'foo.csv' },
								{ profile: 'workflow', steps: [] },
							],
						},
						{
							profile: 'tablebundle',
							name: 'bar',
							sources: [
								{ profile: 'datatable', path: 'bar.csv' },
								{ profile: 'workflow', steps: [] },
							],
						},
					],
				},
			}),
		)

		expect(dp.resources.length).toBe(2)

		const foo = dp.resources[0]!
		const bar = dp.resources[1]!

		expect(dp.resourceManager.names.sort()).toStrictEqual(
			[
				'foo',
				'datatable.json',
				'workflow.json',
				'bar',
				'datatable (1).json',
				'workflow (1).json',
			].sort(),
		)

		foo.sources = [...foo.sources, new Codebook()]
		expect(dp.resourceManager.names.sort()).toStrictEqual(
			[
				'foo',
				'datatable.json',
				'workflow.json',
				'codebook.json',
				'bar',
				'datatable (1).json',
				'workflow (1).json',
			].sort(),
		)

		bar.sources = [...bar.sources, new Codebook()]
		expect(dp.resourceManager.names.sort()).toStrictEqual(
			[
				'foo',
				'datatable.json',
				'workflow.json',
				'codebook.json',
				'bar',
				'datatable (1).json',
				'workflow (1).json',
				'codebook (1).json',
			].sort(),
		)
	})
})

function fileSet(data: Record<string, object>) {
	const result = new Map<string, Blob>()
	for (const [name, resource] of Object.entries(data)) {
		result.set(name, toBlob(resource))
	}
	return result
}
