import { useNavigate } from 'react-router-dom'

const Unauthorized = () =>{
    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    return(
        <section>
            <h1>Unauthorized</h1>
            <br/>
            <p>You do not have access to the requested page.</p>
            <p>
                <button onClick={()=>{goBack()}}>Go Back</button>
                &nbsp;or&nbsp;
                <button onClick={(e)=>{navigate('/login')}}>Log in</button>
            </p>
        </section>
    )
}
export default Unauthorized