import React from 'react'
import './button.css'

export default function Button(props){
	const {children,btnClick,disabled} = props
	const onClickHandler = () =>{
		btnClick()
	}
	return (
		<button className='searchBtn' onClick={onClickHandler} disabled={disabled}>{children}</button>
		)
}