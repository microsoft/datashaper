import { Icon } from '@fluentui/react'
import styled from 'styled-components'

export const SlotWells = (props: any) => {
	console.log('rendering slot!', props)
	return (
		<Container>
			{props.slots.map((slot: any) => {
				return (
					<SlotWell
						placeholder={slot.placeholder}
						iconName={slot.iconName}
						required={slot.required}
					/>
				)
			})}
		</Container>
	)
}

const SlotWell = (props: any) => {
	return (
		<Well>
			<Icon iconName={props.iconName} />
			<Placeholder>{props.placeholder}</Placeholder>
			{props.required && <Required />}
		</Well>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	border: 1px dotted orange;
	padding: 8px;
`
const Well = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #999;
	background: #eee;
	border: 1px dotted #ccc;
	border-radius: 4px;
	padding: 4px;
`
const Placeholder = styled.div``

const Required = styled.div`
	color: ${({ theme }) => theme.application().error().hex()};
	&:before {
		content: '*';
	}
`
