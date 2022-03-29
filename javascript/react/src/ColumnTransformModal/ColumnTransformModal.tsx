/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { columnTransformVerbs, Verb } from '@data-wrangling-components/core'
import { Dropdown, IconButton, Modal, PrimaryButton } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst.js'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import type { ColumnTransformModalProps } from '../index.js'
import {
	useHandleRunClick,
	useHandleStepArgs,
	useInternalStep,
} from './hooks/index.js'

/**
 * This presents a model for creating new columns on a table.
 * It is intended to be invoked from a table or column header.
 */
export const ColumnTransformModal: React.FC<ColumnTransformModalProps> = memo(
	function ColumnTransformModal({
		table,
		step,
		onTransformRequested,
		hideInputColumn,
		hideOutputColumn,
		verbs,
		headerText,
		nextInputTable,
		onDismiss,
		...props
	}) {
		const { internal, setInternal, handleVerbChange } = useInternalStep(
			step,
			nextInputTable,
			table,
		)

		const StepArgs = useHandleStepArgs(
			internal,
			hideInputColumn,
			hideOutputColumn,
		)

		const handleRunClick = useHandleRunClick(internal, onTransformRequested)

		const stepOptions = useMemo(() => {
			const list =
				verbs ||
				columnTransformVerbs(s => s !== Verb.Aggregate && s !== Verb.Rollup)
			return list.map(key => ({
				key,
				text: upperFirst(key),
			}))
		}, [verbs])

		return (
			<Modal
				onDismiss={onDismiss}
				onDismissed={() => setInternal(undefined)}
				{...props}
			>
				<Header>
					<Title>{headerText}</Title>
					{onDismiss && (
						<IconButton
							iconProps={iconProps.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
						/>
					)}
				</Header>
				<Container>
					<Dropdown
						placeholder={'Choose transform'}
						options={stepOptions}
						defaultSelectedKey={internal?.verb || ''}
						onChange={handleVerbChange}
					/>
					{StepArgs && internal ? (
						<>
							<StepArgs step={internal} table={table} onChange={setInternal} />
							<PrimaryButton onClick={handleRunClick}>Run</PrimaryButton>
						</>
					) : null}
				</Container>
			</Modal>
		)
	},
)

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.application().faint().hex()};
`

const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

const Container = styled.div`
	padding: 12px;
`

const iconProps = {
	cancel: { iconName: 'Cancel' },
}
