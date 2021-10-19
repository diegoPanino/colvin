import React from 'react'
import './userCard.css'

export default function UserCard(props){
	const {name,pic} = props.user
	const altString = `${name} profile picture`
	return (
		<div className='card'>
			<div className='imgContainer'>
				<img className='img' src={pic} alt={altString} />
			</div>
			<div className='userContainer'>
				<h4 className='username'>{name}</h4>
			</div>
		</div>
		)
}