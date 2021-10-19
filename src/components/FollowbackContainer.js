import React from 'react'
import './followbackContainer.css'
import UserCard from './UserCard.js'

export default function FollowbackContainer(props){
	const {followBack} = props
	return (
		<div className='followBackContainer'>
			<span>Total followBack: {followBack.count}</span>
			{followBack.userNames.map((user,id) => {
				return <UserCard user = {user} key={user.name+id} />
			})}
		</div>
		)
}