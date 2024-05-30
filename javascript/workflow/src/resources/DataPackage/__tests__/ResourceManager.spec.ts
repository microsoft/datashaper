import { KnownProfile } from '@datashaper/schema'
import { defaultProfiles } from '../../../__tests__/utils.js'

import type { Resource } from '../../Resource.js'
import { DataPackage } from '../DataPackage.js'
import { ResourceManager } from '../ResourceManager.js'
import { toBlob } from '../io.js'

describe('The ResourceManager class', () => {
	let mgr: ResourceManager

	beforeEach(() => {
		const dp = new DataPackage(defaultProfiles())
		mgr = dp.resourceManager
	})

	const inspectResource = (
		resource: Resource | undefined,
		profile: string,
		name: string,
		path = name,
	) => {
		expect(resource).toBeDefined()
		expect(resource?.profile).toBe(profile)
		expect(resource?.name).toBe(name)
		expect(mgr.getResource(name)).toBe(resource)
		expect(mgr.getResourceByPath(path)).toBe(resource)
	}

	it('throws if loading an archive without a datapackage.json entry', async () => {
		// an archive without a datapackage.json
		const empty = new Map()
		await expect(mgr.load(empty)).rejects.toThrow(
			/must contain datapackage.json/,
		)
	})

	it('can load a valid empty archive', async () => {
		const mgr = new ResourceManager()
		const empty = fileSet({ 'datapackage.json': { resources: [] } })
		const result = await mgr.load(empty)
		expect(result.resources).toHaveLength(0)
	})

	it('can load an archive with a single embedded resource', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{ profile: KnownProfile.TableBundle, name: 'tablebundle.json' },
				],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(1)

		inspectResource(
			mgr.topResources[0],
			KnownProfile.TableBundle,
			'tablebundle.json',
		)
	})

	it('can load an archive with a single embedded resource without a names', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [{ profile: KnownProfile.TableBundle }],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(1)

		inspectResource(
			mgr.topResources[0],
			KnownProfile.TableBundle,
			'tablebundle.json',
		)
	})

	it('can load an archive with a two embedded resources without names', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{ profile: KnownProfile.TableBundle },
					{ profile: KnownProfile.TableBundle },
				],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(2)

		inspectResource(
			mgr.topResources[0],
			KnownProfile.TableBundle,
			'tablebundle.json',
		)
		inspectResource(
			mgr.topResources[1],
			KnownProfile.TableBundle,
			'tablebundle (1).json',
		)
	})

	it('can load an archive with embedded resources with names that collide with generator', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{ profile: KnownProfile.TableBundle, name: 'tablebundle (1).json' },
					{ profile: KnownProfile.TableBundle },
					{ profile: KnownProfile.TableBundle },
				],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(3)

		inspectResource(
			mgr.topResources[0],
			KnownProfile.TableBundle,
			'tablebundle (1).json',
		)
		inspectResource(
			mgr.topResources[1],
			KnownProfile.TableBundle,
			'tablebundle.json',
		)
		inspectResource(
			mgr.topResources[2],
			KnownProfile.TableBundle,
			'tablebundle (2).json',
		)
	})

	it('can load an archive with a single nested resource', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{
						profile: KnownProfile.TableBundle,
						name: 'tablebundle.json',
						sources: [
							{
								rel: 'input',
								profile: KnownProfile.DataTable,
								name: 'table.csv',
							},
						],
					},
				],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(1)

		const bundle = mgr.topResources[0]
		inspectResource(bundle, KnownProfile.TableBundle, 'tablebundle.json')

		const datatable = mgr.getResource('table.csv')
		inspectResource(
			datatable,
			KnownProfile.DataTable,
			'table.csv',
			'tablebundle.json/table.csv',
		)

		const children = bundle.sources
		expect(children).toHaveLength(1)
		expect(children[0]).toEqual(datatable)
	})

	it('can load an archive with linked top-level resources', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: ['data/derp/table.json', 'workflow.json', 'codebook.json'],
			},
			'data/derp/table.json': { profile: KnownProfile.TableBundle },
			'workflow.json': { profile: KnownProfile.Workflow },
			'codebook.json': { profile: KnownProfile.Codebook },
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(3)

		expect(mgr.topResources).toHaveLength(3)

		const bundle = mgr.topResources[0]
		inspectResource(
			bundle,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'data/derp/table.json',
		)
		const workflow = mgr.topResources[1]
		inspectResource(
			workflow,
			KnownProfile.Workflow,
			'workflow.json',
			'workflow.json',
		)
		const codebook = mgr.topResources[2]
		inspectResource(
			codebook,
			KnownProfile.Codebook,
			'codebook.json',
			'codebook.json',
		)
	})

	it('can load an archive with linked nested resources', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{
						profile: KnownProfile.TableBundle,
						sources: ['data/workflow.json'], // todo: look up by name as well
					},
				],
			},
			'data/workflow.json': { profile: KnownProfile.Workflow },
			'codebook.json': { profile: KnownProfile.Codebook },
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(1)
		expect(mgr.topResources).toHaveLength(1)

		const bundle = mgr.topResources[0]
		inspectResource(bundle, KnownProfile.TableBundle, 'tablebundle.json')
		expect(bundle.sources).toHaveLength(1)

		const workflow = bundle.sources[0]
		inspectResource(
			workflow,
			KnownProfile.Workflow,
			'workflow.json',
			'data/workflow.json',
		)
	})

	it('can load populated archive with resource ref resources', async () => {
		const files = fileSet({
			'datapackage.json': {
				resources: [
					{
						name: 'mutant-disease',
						profile: KnownProfile.TableBundle,
						sources: [
							'abc123-workflow.json',
							{ rel: 'input', path: 'a/datatable.json' },
						],
					},
				],
			},
			'abc123-workflow.json': { profile: KnownProfile.Workflow },
			'a/datatable.json': { profile: KnownProfile.DataTable },
		})
		await mgr.load(files)
		expect(mgr.topSize).toBe(1)
		expect(mgr.topResources).toHaveLength(1)

		const tableBundle = mgr.topResources[0]
		inspectResource(tableBundle, KnownProfile.TableBundle, 'mutant-disease')

		expect(tableBundle.sources).toHaveLength(2)
	})

	it('can load an archive with sibling refs', async () => {
		const files = fileSet({
			'datapackage.json': {
				resources: ['data/table-1.json', 'data/table-2.json'],
			},
			'data/table-1.json': { name: 'a', profile: KnownProfile.TableBundle },
			'data/table-2.json': {
				profile: KnownProfile.TableBundle,
				sources: [{ rel: 'input', path: 'data/table-1.json' }],
			},
		})

		await mgr.load(files)
		expect(mgr.topSize).toBe(2)
		expect(mgr.topResources).toHaveLength(2)

		const first = mgr.topResources[0]
		inspectResource(first, KnownProfile.TableBundle, 'a', 'data/table-1.json')

		const second = mgr.topResources[1]
		inspectResource(
			second,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'data/table-2.json',
		)
		expect(second.sources).toHaveLength(1)
	})

	it('can load an archive with embedded sibling refs', async () => {
		const files = fileSet({
			'datapackage.json': {
				resources: [
					{ name: 'a', profile: KnownProfile.TableBundle },
					{
						profile: KnownProfile.TableBundle,
						sources: [{ rel: 'input', path: 'a' }],
					},
				],
			},
		})

		await mgr.load(files)
		expect(mgr.topSize).toBe(2)
		expect(mgr.topResources).toHaveLength(2)

		const first = mgr.topResources[0]
		inspectResource(first, KnownProfile.TableBundle, 'a')

		const second = mgr.topResources[1]
		inspectResource(second, KnownProfile.TableBundle, 'tablebundle.json')
		expect(second.sources).toHaveLength(1)
	})
})

function fileSet(data: Record<string, object>) {
	const result = new Map<string, Blob>()
	for (const [name, resource] of Object.entries(data)) {
		result.set(name, toBlob(resource))
	}
	return result
}
