import React from 'react'

//icons
import {faXmark, faAdd} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

function CheckBoxList(props){
    // console.log(props)
    const {
        listName, 
        displayName='List display Name', 
        listItems=[], 
        checkedVals=[], 
        change=function change(e){console.log(e)},
        //change={(e)=>{console.log(e)}},
    } = props.props
    return(
        <>
            <label htmlFor={listName} key={`dis_${displayName}`}>{displayName}:</label>
            <fieldset
                id={listName}
                key={`field_${listName}`}
            >
                {listItems.map((val)=>{
                    return(<span key={`${val}_wrap`}>
                        <input 
                            key={`${val}_input`}
                            type='checkbox' 
                            onChange={(e)=>{change(e)}} 
                            id={`${listName}_${val}`} 
                            value={val}
                            name={listName}
                            checked={checkedVals.includes(val)?true:false}
                        />
                        <label 
                            key={`${val}_lbl`}
                            htmlFor={`${listName}_${val}`}
                        >
                            {val}
                            <FontAwesomeIcon icon={faXmark}/>
                        </label>  
                    </span>)
                })}
            </fieldset>
        </>
    )
}
export default CheckBoxList