/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	Parser,
} from '@datashaper/react'
import type { ParserOptions } from '@datashaper/schema'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback } from 'react'

import { useDataTableSource } from '../../../hooks/index.js'
import { useOptionsButtonCommandBar } from './ParserOptionsEditor.hooks.js'
import {
	Container,
	DetailsListContainer,
	icons,
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from './ParserOptionsEditor.styles.js'
import type { ParserOptionsEditorProps } from './ParserOptionsEditor.types.js'

export const ParserOptionsEditor: React.FC<ParserOptionsEditorProps> = memo(
	function ParserOptionsEditor({ dataTable }) {
		const table = useDataTableSource(dataTable)
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const toolPanelStyles = useToolPanelStyles()
		const optionsButtonCommandBar = useOptionsButtonCommandBar(
			isCollapsed,
			toggleCollapsed,
		)
		const onChangeParser = useCallback(
			(update: ParserOptions) => {
				dataTable?.parser?.loadSchema(update)
			},
			[dataTable],
		)
		return table?.table == null ? null : (
			<Container collapsed={isCollapsed}>
				<DetailsListContainer>
					<ArqueroTableHeader
						background={tableHeaderColors.background}
						styles={tableHeaderStyles}
						farCommandBar={<CommandBar {...optionsButtonCommandBar} />}
						table={table.table}
					/>
					<ArqueroDetailsList
						compact
						sortable
						showColumnBorders
						isHeaderFixed
						fill
						metadata={table.metadata}
						table={table?.table}
					/>
				</DetailsListContainer>
				<ToolPanel
					headerText={'Parser options'}
					onDismiss={toggleCollapsed}
					headerIconProps={icons.settings}
					styles={toolPanelStyles}
				>
					<Parser
						parser={dataTable?.parser?.toSchema()}
						onChange={onChangeParser}
					/>
				</ToolPanel>
			</Container>
		)
	},
)
