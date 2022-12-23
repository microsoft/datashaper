import { KnownProfile } from '@datashaper/schema'
import type { Resource } from '../../Resource.js'
import { toBlob } from '../io.js'
import { ResourceManager } from '../ResourceManager.js'

describe('The ResourceManager class', () => {
	let mgr: ResourceManager

	beforeEach(() => {
		mgr = new ResourceManager()
	})

	const inspectResource = (
		resource: Resource | undefined,
		profile: string,
		name: string,
		path: string,
	) => {
		expect(resource).toBeDefined()
		expect(resource!.profile).toBe(profile)
		expect(resource!.name).toBe(name)
		expect(mgr.getResourceByName(name)).toBe(resource)
		expect(mgr.getResourceByPath(path)).toBe(resource)
	}

	it('throws if loading an archive without a datapackage.json entry', () => {
		// an archive without a datapackage.json
		const empty = new Map()
		expect(mgr.load(empty)).rejects.toThrow(/must contain datapackage.json/)
	})

	it('throws if loading an archive with an invalid reference', () => {
		// an archive referencing a resource that doesn't exist
		const invalidReference = fileSet({
			'datapackage.json': { resources: ['derp.json'] },
		})
		expect(mgr.load(invalidReference)).rejects.toThrow(
			/could not resolve resource "derp.json"/,
		)
	})

	it('throws if loading an archive with a non-reference resource without a profile', async () => {
		// an archive with a non-reference resource that doesn't have a profile
		const invalidProfile = fileSet({
			'datapackage.json': { resources: ['empty'] },
			empty: {},
		})
		expect(mgr.load(invalidProfile)).rejects.toThrow(/schema has no profile/)
	})

	it('throws if loading an archive with a non-reference resource with an unknown profile', async () => {
		// an archive with a non-reference resource that doesn't have a profile
		const invalidProfile = fileSet({
			'datapackage.json': { resources: ['empty'] },
			empty: { profile: 'derp' },
		})
		expect(mgr.load(invalidProfile)).rejects.toThrow(
			/could not construct resource with profile \"derp\", are you missing a resource handler\?/,
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
			mgr.topLevelResources[0]!,
			KnownProfile.TableBundle,
			'tablebundle.json',
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
			mgr.topLevelResources[0]!,
			KnownProfile.TableBundle,
			'tablebundle.json',
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
			mgr.topLevelResources[0]!,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'tablebundle.json',
		)
		inspectResource(
			mgr.topLevelResources[1]!,
			KnownProfile.TableBundle,
			'tablebundle-1.json',
			'tablebundle-1.json',
		)
	})

	it('can load an archive with embedded resources with names that collide with generator', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{ profile: KnownProfile.TableBundle, name: 'tablebundle-1.json' },
					{ profile: KnownProfile.TableBundle },
					{ profile: KnownProfile.TableBundle },
				],
			},
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(3)

		inspectResource(
			mgr.topLevelResources[0]!,
			KnownProfile.TableBundle,
			'tablebundle-1.json',
			'tablebundle-1.json',
		)
		inspectResource(
			mgr.topLevelResources[1]!,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'tablebundle.json',
		)
		inspectResource(
			mgr.topLevelResources[2]!,
			KnownProfile.TableBundle,
			'tablebundle-2.json',
			'tablebundle-2.json',
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

		const bundle = mgr.topLevelResources[0]!
		inspectResource(
			bundle,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'tablebundle.json',
		)

		const datatable = mgr.getResourceByName('table.csv')
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
				resources: ['data/derp/table', 'workflow', 'codebook'],
			},
			'data/derp/table': { profile: KnownProfile.TableBundle },
			workflow: { profile: KnownProfile.Workflow },
			codebook: { profile: KnownProfile.Codebook },
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(3)

		expect(mgr.topLevelResources).toHaveLength(3)

		const bundle = mgr.topLevelResources[0]!
		inspectResource(
			bundle,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'data/derp/table',
		)
		const workflow = mgr.topLevelResources[1]!
		inspectResource(
			workflow,
			KnownProfile.Workflow,
			'workflow.json',
			'workflow',
		)
		const codebook = mgr.topLevelResources[2]!
		inspectResource(
			codebook,
			KnownProfile.Codebook,
			'codebook.json',
			'codebook',
		)
	})

	it('can load an archive with linked nested resources', async () => {
		const archive = fileSet({
			'datapackage.json': {
				resources: [
					{
						profile: KnownProfile.TableBundle,
						sources: ['data/workflow'], // todo: look up by name as well
					},
				],
			},
			'data/workflow': { profile: KnownProfile.Workflow },
			codebook: { profile: KnownProfile.Codebook },
		})
		const result = await mgr.load(archive)
		expect(result.resources).toHaveLength(1)
		expect(mgr.topLevelResources).toHaveLength(1)

		const bundle = mgr.topLevelResources[0]!
		inspectResource(
			bundle,
			KnownProfile.TableBundle,
			'tablebundle.json',
			'tablebundle.json',
		)
		expect(bundle.sources.length).toBe(1)
		const workflow = bundle.sources[0]!
		inspectResource(
			workflow,
			KnownProfile.Workflow,
			'workflow.json',
			'data/workflow',
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
		expect(mgr.topLevelResources).toHaveLength(1)

		const tableBundle = mgr.topLevelResources[0]!
		inspectResource(
			tableBundle,
			KnownProfile.TableBundle,
			'mutant-disease',
			'mutant-disease',
		)

		expect(tableBundle.sources).toHaveLength(2)
	})
})

function fileSet(data: Record<string, object>) {
	const result = new Map<string, Blob>()
	for (const [name, resource] of Object.entries(data)) {
		result.set(name, toBlob(resource))
	}
	return result
}
