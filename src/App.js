import React,{useState,useEffect} from 'react';
import './app.css';
import homework from './img/homework.png'
import * as api from './api/api.js'
import SearchInput from './components/SearchInput.js'
import Loader from './components/Loader.js'
import FollowbackContainer from './components/FollowbackContainer.js'



function App(props){
  //eslint-disable-next-line
  const [resPerPage,setResPerPage] = useState(10)
  const [loading,setLoading] = useState(false)
  const [followBack,setFollowBack] = useState(null)

  useEffect(()=>{
    if(followBack)
      setLoading(false)
  },[followBack])

  const inputHandler =  async input =>{
    setLoading(true)
    const usersFollowback = await api.requestApi(input)
    console.log('App.js->',usersFollowback)
    /*setFollowBack({
      userName:input,
      count:usersFollowback.length,
      userNames:usersFollowback
    })*/
  }

  return (
    <div>
      <header className='header'>
        <img className='headerImg' src={homework} alt="Homework" />
        <h1 className='headerTitle'>Doing homework</h1>
      </header>
      <main className='content'>
          <SearchInput action={(input)=>inputHandler(input)} label='Git user:' buttonText='Search'/>
          {loading ? <Loader/> : followBack && <FollowbackContainer followBack={followBack} />}
      </main>
    </div>
    )
}
export default App;