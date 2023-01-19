/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import styled from '@essex/styled-components'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { DefaultButton, useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'

/**
 * Displays a table name along with a dropdown menu for selection of different tables.
 * @returns
 */
export function tableMenuCommand(
	tables: TableContainer[],
	selectedKey?: string | undefined,
	onChange?: (id: string) => void,
	props?: Partial<ICommandBarItemProps>,
): ICommandBarItemProps {
	const label = chooseLabel(tables, selectedKey)
	return merge(
		{
			key: 'table-dropdown',
			title: label,
			onRender: () => (
				<TableMenu label={label} tables={tables} onChange={onChange} />
			),
		},
		props,
	)
}

// TODO: this should merge with the menu used in the prepare data table bar
const TableMenu: React.FC<{
	tables: TableContainer[]
	label: string
	onChange?: (id: string) => void
}> = (props) => {
	const { tables, label, onChange } = props
	const menuProps = useMemo(() => {
		return {
			items: tables.map((table) => ({
				key: table.id,
				text: table.id,
				onClick: () => onChange?.(table.id),
			})) as IContextualMenuItem[],
		}
	}, [tables, onChange])
	const styles = useStyles()
	return (
		<Container>
			<DefaultButton text={label} menuProps={menuProps} styles={styles} />
		</Container>
	)
}

function useStyles() {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				background: theme.palette.themePrimary,
				color: theme.palette.white,
				textAlign: 'left',
				border: 'none',
			},
			label: {
				fontWeight: 'normal',
			},
		}),
		[theme],
	)
}

function chooseLabel(tables: TableContainer[], selectedKey?: string): string {
	const match = tables.find((t) => t.id === selectedKey)
	if (match) {
		return match.id
	}
	return 'Choose table'
}

const Container = styled.div`
	display: flex;
	align-items: center;
`
