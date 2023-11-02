import { useState } from 'react'

//icons
import {faEllipsis} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Loader = () => {
    
    //list of loading screen texts
    const loadingTextOptions = [
        'Boiling water',
        'Preheating oven',
        'Firing up the grill',
        'Chopping onions',
        'Toasting bread',
        'Mincing garlic',
        'Zesting lemons',
        'Preparing marinade',
        'Peeling potatoes',
    ]

    const [textOption, setTextOption] = useState(Math.floor(Math.random()*loadingTextOptions.length))

    setTimeout(function(){//change text to random options every 2 seconds
        setTextOption(Math.floor(Math.random()*loadingTextOptions.length))
    },2000)

    return(
        <>
            <p className='LoadingText'><i>{loadingTextOptions[textOption]} </i><FontAwesomeIcon icon={faEllipsis} fade /></p>
        </>
    )
}
export default Loader