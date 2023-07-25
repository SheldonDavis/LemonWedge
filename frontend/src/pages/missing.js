import {Link} from 'react-router-dom'

const Missing = () => {
    return(
        <section>
            <h1>Oops!</h1>
            <p>It seems the page you were looking for is missing.</p>
            <Link to='/'>Back to Homepage</Link>
        </section>
    )
}
export default Missing