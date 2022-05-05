import styled from 'styled-components'

const GAP = 18
const INPUT_HEIGHT = 60
const STEPS_HEIGHT = 280
const COLLAPSED_STEPS_HEIGHT = 50

export const SectionTitle = styled.span<{ isCollapsed?: boolean }>`
	margin: 0 ${GAP}px 0 ${GAP}px;
	font-weight: bold;
	writing-mode: vertical-rl;
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.application().lowMidContrast().hex()};
	transform: ${({ isCollapsed }) =>
		isCollapsed ? 'translate(2rem, 0) rotate(-90deg)' : 'rotate(180deg)'};
	cursor: pointer;
	display: flex;
	gap: 0.5rem;
	align-items: center;
`

export const Container = styled.div`
	display: flex;
	flex-flow: column;
	height: 100%;
	width: 100%;
	padding: ${GAP}px 0 ${GAP}px 0;
	gap: ${GAP}px;
	position: relative;
`

export const InputContainer = styled.div`
	display: flex;
	min-height: ${INPUT_HEIGHT}px;
	flex: 0 1 ${INPUT_HEIGHT}px;
	padding-right: ${GAP}px;
	order: 1;
`

export const OutputContainer = styled.div<{
	stepsPosition: string
	isCollapsed: boolean
}>`
	flex: 1 1 auto;
	display: flex;
	padding-right: ${GAP}px;
	max-height: ${({ isCollapsed }) =>
		`calc(100% - ${
			INPUT_HEIGHT + (isCollapsed ? 0 : STEPS_HEIGHT) + GAP * 4
		}px)`};
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 2 : 3)};
`

export const StepsTrayContainer = styled.div<{
	stepsPosition: string
	isCollapsed: boolean
}>`
	display: flex;
	min-height: ${({ isCollapsed }) =>
		isCollapsed ? 'unset' : STEPS_HEIGHT + 'px'};
	background-color: ${({ theme }) => theme.application().faint().hex()};
	padding: 0;
	order: ${({ stepsPosition }) => (stepsPosition === 'bottom' ? 3 : 2)};
	height: ${({ isCollapsed }) =>
		isCollapsed ? COLLAPSED_STEPS_HEIGHT + 'px' : 'auto'};
	overflow: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'auto hidden')};
	> div {
		display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'grid')};
	}
`
export const WorkflowContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
`
