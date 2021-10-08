import React from 'react'
import './followbackContainer.css'

export default function FollowbackContainer(props){
	const {followBack} = props
	return (
		<div className='followBackContainer'>
			<span>total followBack: {followBack.count}</span>
		</div>
		)
}