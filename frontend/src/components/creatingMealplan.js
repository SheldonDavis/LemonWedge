import react, {useState} from 'react'


const CreatingMealplan = ({mealplan=[]}) => {
    //add hook for accessing and using mealplan hook
    return(
        <>
            <section className='creatingMealplan'>
                <h3>My Mealplan:</h3>
                <div className='mealplanWrapper'>
                    <div className='mealplanRecipeList'>
                        {mealplan.map((val, i)=>{
                            return (
                                <div className='recipeCircle' key={val}></div>
                            )
                        })}
                        
                    </div>
                    <div className='meaplanSaveWrapper'>
                        <button type='button'>Save Mealplan</button>
                    </div>
                </div>
            </section>
        </>
    )
}
export default CreatingMealplan