import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableMetadata } from '@essex/arquero'
import type { SaveMetadataFunction } from '@essex/arquero-react'

export interface PreviewTableProps {
	table?: ColumnTable
	name?: string
	metadata?: TableMetadata
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	onChangeMetadata?: SaveMetadataFunction
}
