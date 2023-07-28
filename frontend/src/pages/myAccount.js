import React, {useState, useEffect, useRef} from 'react'

//icons
import {faInfoCircle, faCheckCircle, faSpinner, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

//components
import CheckBoxList from '../components/CheckBoxList'

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

    const errRef=useRef()
    const {auth} = useAuth()
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
            setErrMsg('Something went wrong while retrieving the recipe tags. Try again later.')
        }
    }

    useEffect(()=>{
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
            })
            .catch((e)=>{
              console.error(e)
              setErrMsg(e.response.data.error || `Error status: ${e.response.status} - ${e.response.statusText}`)
              errRef.current.focus()
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
          }

    }

    return(
        <section>
            <h1>My Information</h1>
            <p className={errMsg ? 'errmsg' : 'offscreen'} ref={errRef} >{errMsg}</p>

            <div className={`floatingNotificationBar ${(editsMade||beenUpdated)&&(!takenEmail&&!takenUsername) ? 'onscreen': ''}`}>
                {beenUpdated &&
                    <>
                        <p>
                            Your profile has been updated
                            <span className='valid'><FontAwesomeIcon icon={faCheckCircle}/></span>
                        </p>
                    </>
                }
                {editsMade &&
                    <>
                        <p>
                            You have pending edits to your profile, save changes?
                            <button type='button' onClick={(e)=>handleUpdate()}>Update</button>
                        </p>
                    </>
                }
                {
                    !beenUpdated && !editsMade &&
                    <>
                        <p style={{color:'transparent'}}>nothing to see here</p>
                    </>
                }
            </div>

            <div className='UserDataRow'>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    autoComplete='off'
                    defaultValue={user.username}
                    onChange={(e)=>{changeInput(e)}}
                    onBlur={(e)=>{setCheckingUsername(true);handleInputBlurCheckForDuplicates(e);}}
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
                    autoComplete='off'
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

            <div className='UserDataRow'>
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

            <div className='UserDataRow'>
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

            <div className='UserDataRow'>
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
        </section>

    )
}
export default MyAccount;

