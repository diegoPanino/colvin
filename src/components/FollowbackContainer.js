import React,{useRef,useEffect} from 'react'
import { TransitionGroup, CSSTransition }  from "react-transition-group"

import './followbackContainer.css'
import UserCard from './UserCard.js'

export default function FollowbackContainer(props){
	const {followBack} = props
	const {userName} = followBack
	const resRef = useRef(null)

	useEffect(()=>{
		resRef.current.scrollIntoView({behavior:'smooth'})
	},[])

	return (
		<div className='mainContent'>
			<span className='followBackCount'>{userName}'s followBack: {followBack.count}</span>
			<div className = 'followBackContainer' ref={resRef}>
			<TransitionGroup className = 'followBackContainer example' appear enter >
				{
					followBack.userNames.length 
					? followBack.userNames.map((user,id) => {
						const delay = id * 100
						return(
						<CSSTransition key={id} classNames="example" timeout = {{appear:delay,enter:800+delay}} >
							<UserCard user = {user} key = {`${id}${user}`}/>
						</CSSTransition>
						)
					})
					: <span className = 'followBackCount'>No one is followback {userName} :( </span>
				}
			</TransitionGroup>
			</div>
		</div>
		)
}
