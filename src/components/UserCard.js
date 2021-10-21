import React from 'react'
import './userCard.css'

export default function UserCard(props){
	const {user,pic} = props.user
	const altString = `${user} profile picture`
	return (
		<div className='card' key={user}>
			<div className='imgContainer'>
				<img className='img' src={pic} alt={altString} />
			</div>
			<div className='userContainer'>
				<h4 className='username'>{user}</h4>
			</div>
		</div>
		)
}