import React from 'react'
import './userCard.css'

export default function UserCard(props){
	const {user,pic} = props.user
	const altString = `${user} profile picture`
	const delay = props.id * 100
	return (
		<div className='card' style={{transitionDelay:`${delay}s`}} key={user}>
			<div>
				<img className='img' src={pic} alt={altString} />
			</div>
			<div>
				<h4>{user}</h4>
			</div>
		</div>
		)
}