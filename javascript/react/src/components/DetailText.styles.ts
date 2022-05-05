import styled from 'styled-components'

export const Text = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
`
