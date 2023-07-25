//footer
import React from 'react'

const Footer = (props) => {
    const year = new Date().getFullYear()
    return(
        <footer>
            <h5>SheldonDavis &copy; {year}</h5>
        </footer>
    )
}
export default Footer