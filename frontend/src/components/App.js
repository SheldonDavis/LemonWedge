import React from 'react'

//import styles
import '../styles/App.css';
import '../styles/style.css';

//import page commponents
import Header from './header'
import Footer from './footer'
import SiteRoutes from './routes'

function App() { 
    
    return(
      <>
        <Header />
        <main className="App">          
      
          <div className='container'>
            <SiteRoutes />
               
          </div>
        </main>
        <Footer/>
      </>
    )
}

export default App;
