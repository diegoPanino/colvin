import React,{useState} from 'react';
import './searchInput.css';
import Button from './Button.js'

export default function SearchInput(props){
	const [input,setInput] = useState('')
	const [err,setErr] = useState(false)
	const {label,buttonText,action} = props
	
	const onChangeHandler = e =>{
		const {value} = e.target
		//username allowed are only alphanumeric and not consecutive hypens, nor starting or ending with hypens
		const doubleHypen = value.search(/[^\w-]|(-)\1/) === -1 ? false : true //check alphanumeric and consecutive hypen
		if(value[0] === '-' || value[value.length-1] === '-' || !value.length || doubleHypen)
			setErr(true)
		else
			setErr(false)
		setInput(value)
	}
	const onKeyPressHandler = e =>{
		if(e.key === 'Enter')
			onSubmitHandler()
	}
	const onFocusHandler = () =>{
		setErr(false)
	}
	const onSubmitHandler = () =>{
		if(!input.length)
			setErr(true)
		else
			action(input)
	}
	return(
		<div className='form'>
		 	<h5 className='inputLabel'>{label}</h5>
			<div className='inputWrapper'>
				<input 	className='input' type="text" name="search" value={input}
						onChange={onChangeHandler} onFocus={onFocusHandler} onKeyPress={onKeyPressHandler}
						maxLength='39' autoComplete='off'/>
			</div>
			{err && <span className='errMsg'>Username not valid!!</span>}
			<Button btnClick = {onSubmitHandler} disabled={err}>{buttonText}</Button>
		</div>
		)
}