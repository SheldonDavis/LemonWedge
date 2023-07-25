import {useRef, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {faCheck, faTimes, faInfoCircle, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import UserDataService from '../services/user.serv'

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}/
const PASSW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// const emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

const CreateAccount = () =>{
    const userNameRef = useRef()
    const errRef=useRef()

    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus,setUserFocus]= useState(false)

    const [passW, setPassW] = useState('')
    const [validPassW, setValidPassW] = useState(false)
    const [passWFocus,setPassWFocus]= useState(false)
    const [passWVisible,setPassWVisible] = useState(false)

    const [matchPassW, setMatchPassW] = useState('')
    const [validMatchPassW, setValidMatchPassW] = useState(false)
    const [matchPassWFocus,setMatchPassWFocus]= useState(false)
    const [matchPassVisible,setMatchPassVisible]= useState(false)

    const [email,setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)


    useEffect(()=>{
        userNameRef.current.focus()
    }, [])

    useEffect(()=>{
        setValidName(USERNAME_REGEX.test(user))       
    },[user])

    useEffect(()=>{
        const result = PASSW_REGEX.test(passW)
        setValidPassW(result)

        const match = passW === matchPassW
        setValidMatchPassW(match)

    },[passW, matchPassW])

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email))       
    },[email])

    useEffect(()=>{
        setErrMsg('')
    },[user,passW,matchPassW])


    const togglePWVisible = (e) => {
        setPassWVisible(!passWVisible)
        if(matchPassVisible && passWVisible !== matchPassVisible){
            setMatchPassVisible(!matchPassVisible)
        }
    }
    const toggleMatchVisible = (e) => {
            setMatchPassVisible(!matchPassVisible)
        if(passWVisible && passWVisible !== matchPassVisible){
            setPassWVisible(!passWVisible)            
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        let data = {
            user:user,
            pwd:passW,
            email:email,
          }
        //if button enable with JS hack
        const nameCHECK = USERNAME_REGEX.test(user)
        const pwCHECK = PASSW_REGEX.test(passW)
        const emailCHECK = EMAIL_REGEX.test(email)
        if(!nameCHECK || !pwCHECK || !emailCHECK){
            setErrMsg('Invalid Entry!')
            return
        }

        try{          

            await UserDataService.createUser(data)
            .then(res => {
                setSuccess(true)
                //clear input data from create user form
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else if (e.response?.status === 409){
                    setErrMsg('Username or Email taken')
                }else{
                    setErrMsg('Registration failed')
                }
                errRef.current.focus()
            })

        }catch (err){
            if(!err?.response){
                setErrMsg('No Server Response')
            }else if (err.response?.status === 409){
                setErrMsg('Username or Email taken')
            }else{
                setErrMsg('Registration failed')
            }

            errRef.current.focus()

        }

    }
    return(
        <>{
            success ? (
                <section>
                    <h1>Success!</h1>
                    <p><Link to={'/login'}>Login</Link></p>
                </section>
            ):(
                <section>
                    
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>

                    <h1>Create Account</h1>

                    <form onSubmit={handleSubmit}>
                        
                        <p><label htmlFor='username'>
                            Username:
                            <span className={validName ?'valid':'hide'}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </span>
                            <span className={validName || !user ?'hide':'invalid'}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </span>
                        </label>
                        <input 
                            type='text'
                            id='username'
                            ref={userNameRef}
                            autoComplete='off'
                            onChange={(e)=> setUser(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby='uidnote'
                            onFocus={() => {setUserFocus(true)}}
                            onBlur={() => {setUserFocus(false)}}
                            /></p>
                        <p id='uidnote' className={userFocus && user && !validName ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            4-24 characters.<br/>
                            Must begin with a letter.<br/>
                            Letters, numbers, underscores, and hyphens allowed.
                        </p>
                        
                        <p>
                            <label htmlFor='emial'>Email:</label>
                            <span className={validEmail ? 'valid':'hide'}><FontAwesomeIcon icon={faCheck} /></span>
                            <span className={validEmail || !email ? 'hide':'invalid'}><FontAwesomeIcon icon={faTimes} /></span>
                            <input 
                                type={'email'}
                                id='email'
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                aria-invalid={validEmail ?'false':'true'}
                                aria-describedby='emailNote'
                                onFocus={()=>{setEmailFocus(true)}}
                                onBlur={()=>{setEmailFocus(false)}}
                            />
                        </p>
                        <p id='emailNote' className={emailFocus && !validEmail ? 'instructions':'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Must be a valid email address.
                        </p>

                        <p>
                            <label htmlFor='password'>
                            Password:
                            <span className={validPassW ? 'valid':'hide'}><FontAwesomeIcon icon={faCheck} /></span>
                            <span className={validPassW || !passW ? 'hide':'invalid'}><FontAwesomeIcon icon={faTimes} /></span>
                            </label>
                            <input
                                type={passWVisible?'text':'password'}
                                id='password'
                                onChange={(e)=>setPassW(e.target.value)}
                                required
                                aria-invalid={validPassW ?'false':'true'}
                                aria-describedby='passWNote'
                                onFocus={()=>{setPassWFocus(true)}}
                                onBlur={()=>{setPassWFocus(false)}}
                                />
                            <button type='button' onClick={togglePWVisible} className='showPassBtn'>
                                {passWVisible ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                ):(
                                    <FontAwesomeIcon icon={faEye} />
                                )}
                            </button>
                        </p>
                        <p id='passWNote' className={passWFocus && !validPassW ? 'instructions':'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            8-24 characters.<br/>
                            Must include uppercase and lowercase letters, a number and a special character.<br/>
                            Allowed special characters: <span aria-label=''></span> <span aria-label='hashtag'>#</span> <span aria-label='at symbol'>@</span> <span aria-label='dollar sign'>$</span> <span aria-label='exclaimation mark'>!</span> <span aria-label='percent'>%</span> 
                        </p>

                        <p>
                            <label htmlFor='confirmPassW'>
                                Confirm Password:
                                <span className={validMatchPassW && matchPassW ? 'valid':'hide'}><FontAwesomeIcon icon={faCheck} /></span>
                                <span className={validMatchPassW || !matchPassW ? 'hide':'invalid'}><FontAwesomeIcon icon={faTimes} /></span>
                            </label>
                            <input
                                type={matchPassVisible?'text':'password'}
                                id='confirmPassW'
                                onChange={(e)=>setMatchPassW(e.target.value)}
                                required
                                aria-invalid={validMatchPassW ?'false':'true'}
                                aria-describedby='matchPassWNote'
                                onFocus={()=>{setMatchPassWFocus(true)}}
                                onBlur={()=>{setMatchPassWFocus(false)}}
                                />
                            <button type='button' onClick={toggleMatchVisible} className='showPassBtn'>
                                {matchPassVisible ? (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                    ):(
                                        <FontAwesomeIcon icon={faEye} />
                                )}
                            </button>
                        </p>
                        <p id='matchPassWNote' className={matchPassWFocus && !validMatchPassW ? 'instructions':'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Must match the first password input field. 
                        </p>

                        <br/>
                        <button disabled={!validName || !validMatchPassW || !validPassW ? true : false}>Create Account</button>

                    </form>
                    <p>Already have an Account?<br/>
                    <Link to={'/login'}>Login</Link></p>
                </section>
        )
    }
    </>
    )
}

export default CreateAccount