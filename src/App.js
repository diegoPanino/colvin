import React from 'react';
import './css/app.css';
import homework from './img/homework.png'

function App(props){
  return (
    <div>
      <header className='header'>
        <img className='headerImg' src={homework} alt="Homework" />
        <h1 className='headerTitle'>Doing homework</h1>
      </header>
      <div className='content'>
        <div className='form'>
          <h5 className='inputLabel'>Git user:</h5>
          <input className='input' type="text" />
          <button className='searchBtn' onClick={()=>console.log('click')}>Search</button>
        </div>

      </div>
    </div>
    )
}
export default App;