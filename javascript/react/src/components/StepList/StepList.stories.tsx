/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import { useCallback, useState } from 'react'

import { DisplayOrder } from '../../enums.js'
import { useWorkflow } from '../../hooks/index.js'
import schema from '../verbs/__tests__/specs/every-operation.json'
import { StepList } from './StepList.js'
import type { StepListProps } from './StepList.types.js'

const storyMetadata = {
	title: 'Components/StepHistoryList',
	component: StepList,
}
export default storyMetadata

const workflow = new Workflow(schema)

interface AmbientTables {
	companies: any
	companies2: any
	products: any
	stocks: any
}

const PrimaryComponent: React.FC<StepListProps & AmbientTables> = ({
	companies,
	companies2,
	products,
	stocks,
	...args
}) => {
	const wf = useWorkflow(workflow, [
		{ id: 'companies', table: companies },
		{ id: 'companies2', table: companies2 },
		{ id: 'products', table: products },
		{ id: 'stocks', table: stocks },
	])
	const [selected, setSelected] = useState<string | undefined>()
	const handleSelect = useCallback(
		(id: string) => setSelected((prev) => (prev === id ? undefined : id)),
		[setSelected],
	)
	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepList
				{...args}
				workflow={wf}
				selectedKey={selected}
				onSelect={handleSelect}
			/>
		</div>
	)
}

const SaveDeleteComponent: React.FC<StepListProps & AmbientTables> = ({
	companies,
	companies2,
	products,
	stocks,
	...args
}) => {
	const wf = useWorkflow(workflow, [
		{ id: 'companies', table: companies },
		{ id: 'companies2', table: companies2 },
		{ id: 'products', table: products },
		{ id: 'stocks', table: stocks },
	])
	const [selected, setSelected] = useState<string | undefined>()
	const handleSelect = useCallback(
		(id: string) => setSelected((prev) => (prev === id ? undefined : id)),
		[setSelected],
	)
	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepList
				{...args}
				workflow={wf}
				selectedKey={selected}
				onSelect={handleSelect}
			/>
		</div>
	)
}

const TableButtonsComponent: React.FC<StepListProps & AmbientTables> = ({
	companies,
	companies2,
	products,
	stocks,
	...args
}) => {
	const wf = useWorkflow(workflow, [
		{ id: 'companies', table: companies },
		{ id: 'companies2', table: companies2 },
		{ id: 'products', table: products },
		{ id: 'stocks', table: stocks },
	])
	const [selected, setSelected] = useState<string | undefined>()
	const handleSelect = useCallback(
		(id: string) => setSelected((prev) => (prev === id ? undefined : id)),
		[setSelected],
	)
	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepList
				{...args}
				workflow={wf}
				selectedKey={selected}
				onSelect={handleSelect}
			/>
		</div>
	)
}

const CustomizedComponent: React.FC<StepListProps & AmbientTables> = ({
	companies,
	companies2,
	products,
	stocks,
	...args
}) => {
	const wf = useWorkflow(workflow, [
		{ id: 'companies', table: companies },
		{ id: 'companies2', table: companies2 },
		{ id: 'products', table: products },
		{ id: 'stocks', table: stocks },
	])
	const [selected, setSelected] = useState<string | undefined>()
	const handleSelect = useCallback(
		(id: string) => setSelected((prev) => (prev === id ? undefined : id)),
		[setSelected],
	)
	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepList
				{...args}
				workflow={wf}
				selectedKey={selected}
				onSelect={handleSelect}
			/>
		</div>
	)
}

export const Primary = {
	render: PrimaryComponent,
}

export const SaveDelete = {
	render: SaveDeleteComponent,
	name: 'Save & delete step buttons',
	args: {
		onSave: (s: Step): void => console.log('save', s),
		onDelete: (s: string): void => console.log('delete', s),
	},
}

export const TableButtons = {
	render: TableButtonsComponent,
	name: 'Original/latest buttons',
	args: {
		onSelectInputTable: (): void => console.log('select input table'),
		onSelectLatestTable: (): void => console.log('select latest table'),
	},
}

export const Customized = {
	render: CustomizedComponent,
	args: {
		order: DisplayOrder.LastOnTop,
		styles: {
			buttonContainer: {
				background: 'azure',
				borderBottom: '2px solid teal',
			},
			stepHeaders: {
				name: {
					color: 'orange',
				},
				selected: {
					color: 'crimson',
				},
				details: {
					color: 'teal',
				},
			},
		},
	},
}
