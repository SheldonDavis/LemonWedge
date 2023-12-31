import React from 'react'
//imgs
import KitchenWithGroceries from '../img/KitchenCounter.png'
const About = () => {
    
    return(
        <section className='aboutSection'>
            <h1><i>Fresh is Best!</i></h1>
            <p>Lemon Wedge is a ficticious meal planning aid service dedicated to helping people in cooking for themselves, portion control, and eating fresher and better quality foods.</p>
            <p>
                <img src={KitchenWithGroceries} alt='stock kitchen counter photo'/>
            </p>
            <p>Cooking for yourself helps in your day to day life. We strive to create feelings of productivity, competency, and self-sufficiency. Preparing meals for one's self is an essential skill.</p>
           
            
        </section>
    )
}
export default About