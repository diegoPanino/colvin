import React from 'react'
import {AiOutlineArrowUp} from 'react-icons/ai'
import './topBtn.css'

export default function TopBtn({onClick}){
	const onClickHandler = () =>{
		window.scrollTo({top:0,behavior:'smooth'})
	}
	return (
			<AiOutlineArrowUp className='ToTopBtnContainer' onClick = {onClickHandler} />
		)
}