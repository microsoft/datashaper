/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import type { StoryFn } from '@storybook/react'
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

export const Primary = {
	render: (
		args: StepListProps,
		{ loaded: { companies, companies2, products, stocks } }: any,
	): JSX.Element => {
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
	},
}

export const SaveDelete = {
	render: (
		args: StepListProps,
		{ loaded: { companies, companies2, products, stocks } }: any,
	): JSX.Element => {
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
	},

	name: 'Save & delete step buttons',

	args: {
		onSave: (s: Step) => console.log('save', s),
		onDelete: (s: string) => console.log('delete', s),
	},
}

export const TableButtons = {
	render: (
		args: StepListProps,
		{ loaded: { companies, companies2, products, stocks } }: any,
	): JSX.Element => {
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
	},

	name: 'Original/latest buttons',

	args: {
		onSelectInputTable: () => console.log('select input table'),
		onSelectLatestTable: () => console.log('select latest table'),
	},
}

export const Customized = {
	render: (
		args: StepListProps,
		{ loaded: { companies, companies2, products, stocks } }: any,
	): JSX.Element => {
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
	},

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
