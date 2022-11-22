/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	DataTableSchema,
	ResourceSchema,
	WorkflowSchema,
} from '@datashaper/schema'

import { Codebook } from '../Codebook.js'
import { DataTable } from '../DataTable.js'
import type { Resource } from '../Resource.js'
import { TableBundle } from '../TableBundle.js'
import type { ResourceHandler } from '../types.js'
import { findRel, resolveRawData } from '../utils.js'
import { Workflow } from '../Workflow/Workflow.js'
import type { DataPackage } from './DataPackage.js'
import { write } from './io.js'

export class TableBundlePersistenceHandler implements ResourceHandler {
	public readonly profile = 'tablebundle'
	private _dataPackage: DataPackage | undefined

	public connect(dp: DataPackage) {
		this._dataPackage = dp
	}

	public save(
		resource: TableBundle,
		files: Map<string, Blob>,
	): Promise<string[]> {
		const asset = (name: string) => `data/${resource.name}/${name}`
		const sources: string[] = []
		let dataTableFileName: string | undefined
		let workflowFileName: string | undefined
		let codebookFileName: string | undefined

		// Save the DataTable
		if (resource.datatable != null) {
			const dtSources: string[] = []
			// Save the source data CSV/JSON
			if (resource.datatable.data != null) {
				const dataFileName = asset(
					`${resource.name}.${resource.datatable?.format}`,
				)
				files.set(dataFileName, resource?.datatable.data)
				dtSources.push(dataFileName)
			}
			dataTableFileName = asset('datatable.json')
			files.set(dataTableFileName, write(resource, { sources: dtSources }))
			sources.push(dataTableFileName)
		}

		// Save the Worfklow
		if (resource.workflow != null) {
			workflowFileName = asset('workflow.json')
			files.set(workflowFileName, write(resource.workflow))
			sources.push(workflowFileName)
		}

		// Save the Codebook
		if (resource.codebook != null) {
			codebookFileName = asset('codebook.json')
			files.set(codebookFileName, write(resource.codebook))
			sources.push(codebookFileName)
		}

		// Save the DataBundle
		const bundleFile = asset('databundle.json')
		files.set(bundleFile, write(resource, { sources }))

		return Promise.resolve([bundleFile])
	}

	public async load(
		data: Resource,
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
		const datatableSchema = await findRel<DataTableSchema>(
			'source',
			schema,
			files,
		)
		const codebookSchema = await findRel<CodebookSchema>(
			'codebook',
			schema,
			files,
		)
		const workflowSchema = await findRel<WorkflowSchema>(
			'workflow',
			schema,
			files,
		)

		if (datatableSchema != null) {
			bundle.datatable = new DataTable(datatableSchema)
			// Locate the raw source data for the datatable type
			if (typeof bundle.datatable.path === 'string') {
				bundle.datatable.data = await resolveRawData(
					bundle.datatable.path,
					files,
				)
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
