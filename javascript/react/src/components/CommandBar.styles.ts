import styled from 'styled-components'

export const CommandBarWrapper = styled.div<{
	height?: string
	bgColor: string
	color: string
}>`
	background-color: ${({ bgColor }) => bgColor};
	color: ${({ color }) => color || 'inherit'};
`
