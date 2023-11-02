import React, {useState, useEffect} from 'react'

//icons
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


function InstructionInputs({instructionKey, _id='', step='', addNewStep, updateStep, newRow, setErrMsg}){
    // console.log(`key = ${instructionKey}`)
    //set initial values
    let initialStepAddedState = 'new'
    let initialStepText = ''
    let initialStepID = (instructionKey)
    // console.log(`DEFINE: initialStepID = ${initialStepID}`)
        if(_id){
            initialStepAddedState = 'added'
            initialStepText = step
            initialStepID = _id
            // console.log(`IN IF: initialStepID = ${initialStepID}`)
            
        }
    const [impState, setImpState] = useState(initialStepAddedState)
    const [stepText, setStepText] = useState(initialStepText)
    const [stepID, setStepID] = useState(initialStepID)
    
    useEffect(()=>{
        if(newRow){
            setStepID(instructionKey)
            setStepText('')
            setImpState('new')
        }
        if(_id){
            setStepID(_id)
            setStepText(step)
            setImpState('added')
        }
    },[initialStepID])

    const setUpForSaveAdd = () => {//compile new ingredient data for parent acessability
        addNewStep(stepID, stepText)
        setImpState('new')
        setStepText('')
    }

    const setUpForSaveUpdate = () => {//compile updated data for parent accessbility
        updateStep(stepID, stepText)
        setImpState('added')
    }

    const handleStepTextChange = (e) => {//onchange handler of textarea
        setStepText(e.target.value)
        setImpState('updating')
        setErrMsg('')
    }

    return(
        <>
            <textarea 
            className={`instruction_step_${stepID} id_${_id}`}
            cols='50' 
            rows='5' 
            style={{resize:'none'}} 
            maxLength='250' 
            placeholder={`Instructions`} 
            value={stepText} 
            onChange={handleStepTextChange}></textarea>

            
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
export default InstructionInputs
