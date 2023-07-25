import React, {useState, useRef, useEffect} from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import UserDataService from '../services/user.serv'
import useInput from '../hooks/useInput'
import useToggle from '../hooks/useToggle'

// import {faCheck, faTimes, faInfoCircle, faEye} from '@fortawesome/free-solid-svg-icons'
// import {faEye as faEyeReg} from '@fortawesome/free-regular-svg-icons'
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Login = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { setAuth } = useAuth()
  const userRef = useRef()
  const errRef = useRef()

  const [user, resetUser, userAttribs]= useInput('user','')//useLocalStorage('user','')//useState('')//('Admin')//for dev set value back to empty string later
  const [pwd, setPwd]= useState('')//('C0mplex1ty$')//for dev set value back to empty string later
  const [errMsg, setErrMsg]= useState('')
  const [check, toggleCheck] = useToggle('persist', false)

  useEffect(()=>{
    setErrMsg('')
  },[user,pwd])

  const handleLogin = async (e) => {
    e.preventDefault()
  
    let data = {
      user:user,
      pwd:pwd,
    }

    try{          
        await UserDataService.loginUser(data)
        .then(res => {
          const accessToken = res?.data?.accessToken
          // const roles = res?.data?.roles

          // setAuth({user,pwd,roles,accessToken})
          setAuth({user,accessToken})
          // setUser('')
          resetUser('')
          setPwd('')

          navigate(from, {replace:true})

        })
        .catch((e)=>{
            console.error(e)
            setErrMsg('An unexpected error has occurred: '+e)
            errRef.current.focus()
        })

    }catch (err){
      console.error(err)
        if(!err?.response){
            setErrMsg('No Server Response')
        }else if (err.response?.status === 400){
            setErrMsg('Missing username or password')
        }else if (err.response?.status === 401){
            setErrMsg('Unauthorized')
        }else{
            setErrMsg('Login failed')
        }

        errRef.current.focus()

    }

  }

  
  return (
    <section>
      <p ref={errRef} className={errMsg?'errmsg':'offscreen'} aria-live='assertive'>{errMsg}</p>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor='username'>Username</label>
        <input 
          type='text' 
          id='username' 
          placeholder='enter username'
          ref={userRef}
          autoComplete='off'
          required 
          {...userAttribs}
        />

        <br/>

        <label htmlFor='password'>Password</label>
        <input 
          type='password' 
          id='password' 
          placeholder='enter password'
          required 
          onChange={(e)=>{setPwd(e.target.value)}}
          value={pwd}
        />

        <button type='submit'>Sign In</button>
        <div className='persistCheck'>
          <input 
            type='checkbox'
            id='persist'
            onChange={toggleCheck}
            checked={check}
          />
          <label htmlFor='persist'>Trust this device</label>
        </div>
        <br/>
        <p>Don't have an account?<br/><Link to='/login/create'>Create an account</Link></p>
      </form>
    </section>
  )
}

export default Login;
