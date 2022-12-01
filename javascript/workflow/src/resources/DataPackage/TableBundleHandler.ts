/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	DataTableSchema,
	ResourceRelationship,
	ResourceSchema,
	TableBundleSchema,
	WorkflowSchema,
} from '@datashaper/schema'
import { KnownProfile, TableBundleRel } from '@datashaper/schema'

import { Codebook } from '../Codebook.js'
import { DataTable } from '../DataTable.js'
import type { Resource } from '../Resource.js'
import { TableBundle } from '../TableBundle.js'
import type { ResourceHandler } from '../types.js'
import { findRel, resolveRawData } from '../utils.js'
import { Workflow } from '../Workflow/Workflow.js'
import type { DataPackage } from './DataPackage.js'
import { write } from './io.js'

export class TableBundleHandler implements ResourceHandler {
	public readonly profile = KnownProfile.TableBundle
	private _dataPackage: DataPackage | undefined

	public connect(dp: DataPackage): void {
		this._dataPackage = dp
	}

	public save(
		resource: TableBundle,
		files: Map<string, Blob>,
	): Promise<string[]> {
		const asset = (name: string) => `data/${resource.name}/${name}`
		const sources: ResourceRelationship[] = []
		let dataTableFileName: string | undefined
		let workflowFileName: string | undefined
		let codebookFileName: string | undefined

		// Save the DataTable
		if (resource.input != null) {
			const dtSources: string[] = []
			// Save the source data CSV/JSON
			if (resource.input.data != null) {
				const dataFileName = asset(`${resource.name}.${resource.input?.format}`)
				files.set(dataFileName, resource?.input.data)
				dtSources.push(dataFileName)
			}
			dataTableFileName = asset('datatable.json')
			files.set(
				dataTableFileName,
				write(resource.input, { sources: dtSources }),
			)
			sources.push({ rel: TableBundleRel.Input, source: dataTableFileName })
		}

		// Save the Worfklow
		if (resource.workflow != null) {
			workflowFileName = asset('workflow.json')
			files.set(workflowFileName, write(resource.workflow))
			sources.push({ rel: TableBundleRel.Workflow, source: workflowFileName })
		}

		// Save the Codebook
		if (resource.codebook != null) {
			codebookFileName = asset('codebook.json')
			files.set(codebookFileName, write(resource.codebook))
			sources.push({ rel: TableBundleRel.Codebook, source: codebookFileName })
		}

		// Save the DataBundle
		const bundleFile = asset('databundle.json')
		files.set(bundleFile, write(resource, { sources }))

		return Promise.resolve([bundleFile])
	}

	public async load(
		data: TableBundleSchema,
		files: Map<string, Blob>,
	): Promise<Resource[]> {
		const bundle = new TableBundle(data)
		bundle.connect(this._dataPackage!)
		await this._loadBundleSources(bundle, data, files)
		return [bundle]
	}

	private async _loadBundleSources(
		bundle: TableBundle,
		schema: ResourceSchema,
		files: Map<string, Blob>,
	): Promise<void> {
		const [datatableSchema, codebookSchema, workflowSchema] = await Promise.all(
			[
				await findRel<DataTableSchema>(TableBundleRel.Input, schema, files),
				await findRel<CodebookSchema>(TableBundleRel.Codebook, schema, files),
				await findRel<WorkflowSchema>(TableBundleRel.Workflow, schema, files),
			],
		)

		if (datatableSchema != null) {
			bundle.input = new DataTable(datatableSchema)
			// Locate the raw source data for the datatable type
			if (typeof bundle.input.path === 'string') {
				bundle.input.data = await resolveRawData(bundle.input.path, files)
			}
		}
		if (codebookSchema != null) {
			bundle.codebook = new Codebook(codebookSchema)
		}
		if (workflowSchema != null) {
			bundle.workflow = new Workflow(workflowSchema)
		}
	}
}
