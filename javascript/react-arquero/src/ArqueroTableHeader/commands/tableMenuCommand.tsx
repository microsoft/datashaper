/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { DefaultButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import merge from 'lodash-es/merge.js'
import { useMemo } from 'react'
import styled from 'styled-components'

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
}> = props => {
	const { tables, label, onChange } = props
	const menuProps = useMemo(() => {
		return {
			items: tables.map(table => ({
				key: table.id,
				text: table.id || table.name,
				onClick: () => onChange && onChange(table.id),
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
	const theme = useThematic()
	return useMemo(
		() => ({
			root: {
				background: theme.application().accent().hex(),
				color: theme.application().background().hex(),
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
	const match = tables.find(t => t.id === selectedKey)
	if (match) {
		return match.name || match.id
	}
	return 'Choose table'
}

const Container = styled.div`
	display: flex;
	align-items: center;
`
