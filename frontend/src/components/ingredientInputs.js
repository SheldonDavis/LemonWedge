import React, {useState, useEffect} from 'react'

//icons
import { faPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

function IngredientInputs({ingredientKey, name='', measurement='', note='', _id='', addNewIngredient, updateIngredient, newRow, setErrMsg}){
    //setup initial value variables
    let initialIngredientName = ''
    let initialIngredientMeasurement = ''
    let initialIngredientNote = ''
    let initialIngredientID = (ingredientKey)
    let initialIngredientAddedState = 'new'
    if(_id && !newRow){
        //assign initial values
        initialIngredientName = name
        initialIngredientMeasurement = measurement
        initialIngredientNote = note
        initialIngredientID = _id
        initialIngredientAddedState = 'added'
    }

    //setup states for carrying data
    const [ingName, setIngName] = useState(name)
    const [ingMeasurement, setIngMeasurement] = useState(measurement)
    const [ingNote, setIngNote] = useState(note)
    const [ingID, setIngID] = useState(_id)
    const [impState, setImpState] = useState('added')

    useEffect(()=>{
        if(newRow){
            setIngName('')
            setIngMeasurement('')
            setIngNote('')
            setIngID(ingredientKey)
            setImpState('new')
        }
        if(_id){
            setIngName(name)
            setIngMeasurement(measurement)
            setIngNote(note)
            setIngID(_id)
            setImpState('added')
        }
    },[initialIngredientID])

    const setUpForSaveAdd = () => {//compile new ingredient data for parent acessability
        addNewIngredient(ingName, ingMeasurement, ingNote, ingID)

        setImpState('new')
        setIngName('')
        setIngMeasurement('')
        setIngNote('')
    }

    const setUpForSaveUpdate = () =>{//compile updated data for parent accessbility
        updateIngredient(ingName, ingMeasurement, ingNote, ingID)
        setImpState('added')
    }

    return(
        <>
            <div className='ingredientInputWrapper'>
                <span className='ingredientinputLine'>
                    <label htmlFor='name'>Ingredient:</label>
                    <input type='text' id='name'  placeholder='Bread' onChange={(e)=>{
                        setIngName(e.target.value)
                        setImpState('updating')
                        setErrMsg('')       
                        }} value={ingName}/>

                </span>
                <span className='ingredientinputLine'>
                    <label htmlFor='measurement'>Measurement:</label>
                    <input type='text' id='measurement'  placeholder={`2 slices`} onChange={(e)=>{
                        setIngMeasurement(e.target.value)
                        setImpState('updating')
                        setErrMsg('')       
                        }} value={ingMeasurement}/>

                </span>
                <span className='ingredientinputLine'>
                    <label htmlFor='note'>Notes:</label>
                    <input type='text' id='note'  placeholder='Fresh is best!' onChange={(e)=>{
                        setIngNote(e.target.value)
                        setImpState('updating')
                        setErrMsg('')       
                    }} value={ingNote}/>

                </span>


            </div>

            {//create add button for adding a new ingedient
                impState==='new' || newRow
            ?(
                <button type='button' onClick={setUpForSaveAdd}><FontAwesomeIcon icon={faPlus} /></button>
            )
            :<></>
            }
            {//create update button for when a row has updated information
            impState==='updating' && !newRow
            ?(
                <button type='button' onClick={setUpForSaveUpdate}><FontAwesomeIcon icon={faCheck} /></button>
            )
            :<></>
            }

        </>
    )
}
export default IngredientInputs