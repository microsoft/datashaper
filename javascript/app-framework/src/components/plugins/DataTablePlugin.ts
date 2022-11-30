import { DataTable } from '@datashaper/workflow'
import { KnownProfile } from '@datashaper/schema'
import { ProfilePlugin, ResourceGroup } from '../../types.js'
import { DataSourceEditor, RawTableViewer } from '../editors/index.js'

export class DataTablePlugin implements ProfilePlugin<DataTable> {
	public readonly profile = KnownProfile.DataTable
	public readonly title = 'Datatable'
	public readonly renderer = DataSourceEditor
	public readonly iconName = 'PageData'
	public readonly group = ResourceGroup.Data

	public createResource(): DataTable {
		return new DataTable()
	}

	public onGetRoutes(resource: DataTable, pathContext: string) {
		const dataPath = Array.isArray(resource.path)
			? resource.path[0]
			: resource.path
		if (dataPath != null) {
			const pathItems = dataPath.split('/') ?? []
			const lastPathItem = pathItems[pathItems.length - 1]
			if (lastPathItem != null) {
				return {
					preItemSiblings: [
						{
							title: lastPathItem,
							href: `${pathContext}/${lastPathItem}`,
							icon: 'Database',
							renderer: RawTableViewer,
							props: { dataTable: resource },
						},
					],
				}
			}
		}
	}
}
