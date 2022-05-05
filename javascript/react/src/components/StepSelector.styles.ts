import styled from 'styled-components'

export const Container = styled.div`
	width: 240px;
	display: flex;
	align-items: center;
`

export const SearchContainer = styled.div`
	border-bottom: 1px solid
		${({ theme }) => theme.application().lowContrast().hex()};
`

export const icons = {
	add: { iconName: 'Add' },
}
