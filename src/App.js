import React,{useState,useEffect} from 'react';
import './app.css';
import logo from './img/gitHubMark.png'
import * as api from './api/api.js'
import SearchInput from './components/SearchInput.js'
import Loader from './components/Loader.js'
import FollowbackContainer from './components/FollowbackContainer.js'
import TopBtn from './components/TopBtn'


function App(props){
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState(null)
  const [followBack,setFollowBack] = useState(null)
  const [showTopBtn,setShowTopBtn] = useState(false)

  useEffect(()=>{
    window.addEventListener('scroll',()=>{
      if(window.pageYOffset > 300)
        setShowTopBtn(true)
      else
        setShowTopBtn(false)
      return ()=>window.removeEventListener('scroll')
    })
  },[])

  useEffect(()=>{
    if(followBack || err)
      setLoading(false)
  },[followBack,err])

  const inputHandler =  async input =>{
    setLoading(true)
    setFollowBack(null)
    setErr(null)
    const usersFollowback = await api.requestApi(input)
    console.log('App.js->',usersFollowback)
    switch(usersFollowback.status){
      case 'ok' : {
                setFollowBack({
                    userName:input,
                    count:usersFollowback.list.length,
                    userNames:usersFollowback.list
                })
                break    
      }
      case 'api' : {
                setFollowBack({
                    userName:input,
                    count:usersFollowback.list.length,
                    userNames:usersFollowback.list
                })
                setErr('Api limit exceeded.Fake api used')
                break
      }
      case 'not found' : {
                setErr('User not found')
                break
      }
      default:{
                setErr(usersFollowback.msg)
                break
      }
    }
    
  }


  return (
    <div>
      <header className='header'>
        <a href='https://github.com/diegoPanino/colvin' alt='This project repo' target='_blank' rel='noreferrer'>
          <img className='headerImg' src={logo} alt="Homework" />
        </a>
        <h1 className='headerTitle'>Who is following me back?</h1>
      </header>
      <main className='content'>
          <SearchInput action={(input)=>inputHandler(input)} label='Git user:' buttonText='Search'/>
          {err && <span className = 'errMsg'>{err}</span>}
          {loading ? <Loader/> : followBack && <FollowbackContainer followBack={followBack} />}
      </main>
      {showTopBtn && <TopBtn />}
    </div>
    )
}
export default App;