import React, {useState, useEffect, useRef} from 'react'

import { useNavigate } from 'react-router-dom'

//icons
import {faInfoCircle, faCheckCircle, faSpinner, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

//components
import CheckBoxList from '../components/CheckBoxList'
import Loader from '../components/loader'

//services
import UserDataService from '../services/user.serv.js'
import RecipeDataService from '../services/recipe.serv'

//hooks
import useAuth from '../hooks/useAuth'

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}/
const PASSW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

//user account information page
const MyAccount = () => {
    const [loading,setLoading]=useState(true)
    const errRef=useRef()
    const {auth} = useAuth()
    const navigate = useNavigate()
    const [userDefault, setUserDefault]= useState({
        allergies:'',
        dislikes:'',
        email:'',
        firstName:'',
        lastName:'',
        likes:'',
        updatedAt:'',
        username:'',
        _id:''})
    const [user, setUser]= useState({
        allergies:'',
        dislikes:'',
        email:'',
        firstName:'',
        lastName:'',
        likes:'',
        updatedAt:'',
        username:'',
        _id:''})
    const [recipeTagsText, setRecipeTagsText] = useState([])
    const [recipeTagsVals, setRecipeTagsVals] = useState([])
    const [checkingUsername,setCheckingUsername] = useState(false)
    const [takenUsername,setTakenUsername] = useState(false)
    const [checkingEmail,setCheckingEmail] = useState(false)
    const [takenEmail,setTakenEmail] = useState(false)
    const [errMsg,setErrMsg] = useState('')
    const [editsMade, setEditsMade] = useState(false)
    const [beenUpdated,setBeenUpdated] = useState(false)

    const [newPassword, setNewPassword] = useState('')
    const [disablePWUpdate, setdisablePWUpdate] = useState(true)

    const getThisUserInfo = async () => {
        try{
            await UserDataService.getMe(auth.accessToken)
            .then(res => {
                setUserDefault(JSON.stringify(res.data))
                setUser(res.data)
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
            })
        }catch(e){
            console.error(e)
            setErrMsg('Something went wrong while retrieving your profile data. Try again later.')
        }
    }

    const getAllRecipeTags = async () => {
        try{
            await RecipeDataService.getTags(auth.accessToken)
            .then(res => {
                let tagTexts = []
                let tagVals = []
                res.data.map((val)=>{
                    tagTexts.push(val.tagName)
                    tagVals.push(val.tagval)
                })
                setRecipeTagsText(tagTexts)
                setRecipeTagsVals(tagVals)
                setLoading(false)
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
                setLoading(false)
            })
        }catch(e){
            console.error(e)
            setErrMsg('Something went wrong while retrieving the recipe tags. Try again later.')
            setLoading(false)
        }
    }

    useEffect(()=>{
        setLoading(true)
        getThisUserInfo()
        getAllRecipeTags()
    },[])

    useEffect(()=>{
        setEditsMade(JSON.stringify(user) !== userDefault)
        setBeenUpdated(false)
        // setTakenUsername(false)
        // setTakenEmail(false)
    },[user])

    const changeInput = (e) => {
        //setup variables for object key and object value
        const {value,name,type} = e.target

        //clear error message
        setErrMsg('')

        //handle for checkboxes to allow comma seperated list for values
        if(type === 'checkbox'){
            let listIndex = Object.keys(user).indexOf(name)
            let currentValues = Object.values(user)[listIndex] || []
            let index = currentValues.indexOf(value)
            let newValues = []

            if(currentValues?.includes(value)){
                //remove value from array
                newValues = currentValues
                //item to be removed is set to variable, ignorable. don't need to save this for later.
                let removed = newValues.splice(index, 1)

                //set empty array to null value
                if(newValues.length===0)newValues=null
            }else{
                //add value to array
                newValues = [].concat(currentValues, value)
            }
            setUser({...user, [name] : newValues})
        }else if (type==='email'){
            //verify that email follows email regex
            if(EMAIL_REGEX.test(value)){
                setUser({...user, [name] : value})
            }else{
                setErrMsg('Email must be a valid email address.')
                errRef.current.focus()
            }
            // const nameCHECK = USERNAME_REGEX.test(user)
            // const pwCHECK = PASSW_REGEX.test(passW)
            // const emailCHECK = EMAIL_REGEX.test(email)
        }else if (type==='text' && name==='username'){
            if(USERNAME_REGEX.test(value)){
                setUser({...user, [name] : value})
            }else{
                setErrMsg('Username must have 4-24 characters. Must begin with a letter. Letters, numbers, underscores, and hyphens allowed.')
                errRef.current.focus()
            }
        }else if (type==='password' && name==='password'){
            if(PASSW_REGEX.test(value)){
                setNewPassword(value)
                setdisablePWUpdate(false)
            }else{
                setErrMsg('Password must have 8-24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: #, @, $, !, and %')
                setNewPassword('')
                setdisablePWUpdate(true)
                errRef.current.focus()
            }
        }else{
            //set or update user state to reflect the data in the input fields
            setUser({...user, [name] : value})
        }

        //do stuff to update user information
    }

    const handleInputBlurCheckForDuplicates = async (e) => {

        //deconstruct items being sent over
        const {value,name,type} = e.target

        let data = {[name]:value}
        //check what's stored in database object
        let defaults = JSON.parse(userDefault)
        if(defaults[[name]]===value){
            //value provided matches what is stored in the database. Do nothing more
            if(name==='username') {
                setCheckingUsername(false)
                setTakenUsername(false)
            }                
            if(name==='email') {
                setCheckingEmail(false)
                setTakenEmail(false)
            }
            return
        }
        //run API and check if duplicate
        try{
            await UserDataService.checkDups(data)
            .then(res => {
                //response is status 200
                //username is good to use
                
                if(name==='username') {
                    setCheckingUsername(false)
                    setTakenUsername(false)
                }                
                if(name==='email') {
                    setCheckingEmail(false)
                    setTakenEmail(false)
                }
                
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else if (e.response?.status === 409){
                    if(name==='username') {
                        setCheckingUsername(false)
                        setTakenUsername(true)
                        setErrMsg('Username already in use')
                    }                
                    if(name==='email') {
                        setCheckingEmail(false)
                        setTakenEmail(true)
                        setErrMsg('email already in use')
                    }
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
            })
        }catch(e){
            console.error(e)
            setErrMsg('Something went wrong while retrieving your profile data. Try again later.')
        }
        // console.log(`Check if username or email already exist in database and is not`)
    }

    const handleUpdate = async (e)=>{
        const {username, email} = user

        try{
            await UserDataService.updateUser(user, auth.accessToken)
            .then(res => {
                setBeenUpdated(true)
                setEditsMade(false)
                setUserDefault(JSON.stringify(user))
                setTimeout(()=>{
                    setBeenUpdated(false)
                },5000)
                setLoading(false)
            })
            .catch((e)=>{
              console.error(e)
              setErrMsg(e.response.data.error || `Error status: ${e.response.status} - ${e.response.statusText}`)
              errRef.current.focus()
              setLoading(false)
            })

          }catch(err){
            if(!err?.response){
              setErrMsg('No Server Response')
            }else if (err.response?.status === 409){
              setErrMsg('Username taken')
            }else{
              setErrMsg('Update failed')
              console.error(err)
            }

            errRef.current.focus()
            setLoading(false)
          }

    }

    const handleUpdatePassword = async (e) =>{
        let data={
            _id:user._id,
            pw:newPassword,
        }
        try{
            await UserDataService.updatePassword(data, auth.accessToken)
            .then(res => {
                navigate('/logout',{
                    replace:true,
                    state:{newPW:true},
                })
                setLoading(false)
            })
            .catch((e)=>{
              console.error(e)
              setErrMsg(e.response.data.error || `Error status: ${e.response.status} - ${e.response.statusText}`)
              errRef.current.focus()
              setLoading(false)
            })
        }catch(err){
            if(!err?.response){
              setErrMsg('No Server Response')
            }else{
              setErrMsg('Password Update failed')
              console.error(err)
            }

            errRef.current.focus()
            setLoading(false)
          }
    }

    async function confirmPasswordUpdate(){
        setLoading(true)
        if(window.confirm('Are you sure you want to update your password?\r\nSelecting \'OK\' will log you out and update your password.')){

            let doubleCheckPW = prompt('Please re-enter your new password.')
            if (doubleCheckPW===newPassword && newPassword !==''){
                await handleUpdatePassword()
            }else{
                setErrMsg('The confirmation password did not match what was initially entered.\r\nPlease try again.')
                errRef.current.focus()
                setLoading(false)
            }

        }
        // else{
        //     // console.log('nothing should happen. password remains the same.')
        // }
        
    }

    return(
        <section>
            {loading
            ?<>
                <Loader/>
            </>
            :<>
                <div className={`floatingNotificationBar ${(editsMade||beenUpdated)&&(!takenEmail&&!takenUsername) ? 'onscreen': ''}`}>
                    {beenUpdated &&
                        <>
                            <p>
                                Your profile has been updated
                                <span className='valid'><FontAwesomeIcon icon={faCheckCircle}/></span>                                              
                                <button type='button' style={{opacity:'0'}}>i'm invisible</button>
                            </p>
                        </>
                    }
                    {editsMade &&
                        <>
                            <p>
                                You have pending edits to your profile, save changes?
                                <button type='button' onClick={(e)=>{setLoading(false);handleUpdate()}}>Update</button>
                            </p>
                        </>
                    }
                    {
                        !beenUpdated && !editsMade &&
                        <>
                            <p style={{color:'transparent'}}>nothing to see here                        
                                <button type='button' style={{opacity:'0'}}>i'm invisible</button>
                            </p>
                        </>
                    }
                </div>
                <h1>My Information</h1>
                <p className={errMsg ? 'errmsg' : 'offscreen'} ref={errRef} >{errMsg}</p>
                {
                    user._id != '6512ec5f31861ce73bfb4e4d' && 
                    //disable PW update when on tester account
                    <>
                        <div className='UserDataRow'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                autoComplete='new-password'
                                defaultValue={newPassword}
                                onChange={(e)=>{changeInput(e)}}
                                // onBlur={(e)=>{setCheckingEmail(true);handleInputBlurCheckForDuplicates(e);}}
                                // className={!user.email ? 'missingRequired' : undefined}
                            />
                            <button type='button' disabled={disablePWUpdate} onClick={(e)=>{confirmPasswordUpdate()}}>Update Password</button>
                            <p className='smallNoMargin'><i>Your password is a unique update and can only be updated on it's own. Other account updates must be made seperately.</i></p>
                        </div>
                    </>
                }
                    

                <div className='UserDataRowWrapper'>
        
                    <div className='UserDataRow'>
                        <label htmlFor='username'>Username:</label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            autoComplete='new-username'
                            defaultValue={user.username}
                            onChange={(e)=>{changeInput(e)}}
                            onBlur={(e)=>{setCheckingUsername(true);handleInputBlurCheckForDuplicates(e);}}
                            readOnly={user._id === '6512ec5f31861ce73bfb4e4d'}//for tester only so people can use test account
                            className={!user.username ? 'missingRequired' : undefined}
                        />
                        {!user.username&&
                            <span className='missingIcon'><FontAwesomeIcon icon={faInfoCircle} title='missing username' cursor='help'/></span>
                        }
                        {checkingUsername &&
                            <span><FontAwesomeIcon icon={faSpinner} title='checking if username is available' cursor='loading' spin/></span>
                        }
                        {takenUsername &&
                            <span className='missingIcon'><FontAwesomeIcon icon={faXmark} title='username taken'/></span>
                        }
                    </div>

                    <div className='UserDataRow'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            autoComplete='new-email'
                            defaultValue={user.email}
                            onChange={(e)=>{changeInput(e)}}
                            onBlur={(e)=>{setCheckingEmail(true);handleInputBlurCheckForDuplicates(e);}}
                            className={!user.email ? 'missingRequired' : undefined}
                        />
                        {!user.email&&
                            <span className='missingIcon'><FontAwesomeIcon icon={faInfoCircle} title='missing emial' cursor='help'/></span>
                        }
                        {checkingEmail &&
                            <span><FontAwesomeIcon icon={faSpinner} title='checking if email is available' cursor='loading' spin/></span>
                        }
                        {takenEmail &&
                            <span className='missingIcon'><FontAwesomeIcon icon={faXmark} title='email taken'/></span>
                        }
                    </div>


                    <div className='UserDataRow'>
                        <label htmlFor='fName'>First name:</label>
                        <input
                            type='text'
                            id='fName'
                            name='firstName'
                            autoComplete='off'
                            defaultValue={user.firstName}
                            onChange={(e)=>{changeInput(e)}}
                            className={!user.firstName ? 'missingRequired' : undefined}
                        />
                        {!user.firstName&&
                            <span className='missingIcon'><FontAwesomeIcon icon={faInfoCircle} title='missing first name' cursor='help'/></span>
                        }
                    </div>

                    <div className='UserDataRow'>
                        <label htmlFor='lName'>Last name:</label>
                        <input
                            type='text'
                            id='lName'
                            name='lastName'
                            autoComplete='off'
                            defaultValue={user.lastName}
                            onChange={(e)=>{changeInput(e)}}
                            className={!user.lastName ? 'missingRequired' : undefined}
                        />
                        {!user.lastName&&
                            <span className='missingIcon'><FontAwesomeIcon icon={faInfoCircle} title='missing last name' cursor='help'/></span>
                        }
                    </div>

                    <div className='UserDataRow fullWidthUserRow'>
                        <CheckBoxList
                            props={{
                                listName:'likes',
                                displayName:'Likes',
                                listItems:recipeTagsText,
                                checkedVals:user.likes,
                                change: changeInput,
                                listVals: recipeTagsVals,
                            }}
                        />
                    </div>

                    <div className='UserDataRow fullWidthUserRow'>
                        <CheckBoxList
                            props={{
                                listName:'dislikes',
                                displayName:'Dislikes',
                                listItems:recipeTagsText,
                                checkedVals:user.dislikes,
                                change: changeInput,
                                listVals: recipeTagsVals,
                            }}
                        />
                    </div>

                    <div className='UserDataRow fullWidthUserRow'>
                        <CheckBoxList
                            props={{
                                listName:'allergies',
                                displayName:'Allergies',
                                listItems:['shellfish','fish','gluten','dairy','peanut','treenut','soy','egg','sesame','mustard','sulfite','nightshade',],
                                checkedVals:user.allergies,
                                change: changeInput,
                            }}
                        />
                    </div>
                </div>
            </>}
        </section>

    )
}
export default MyAccount;

