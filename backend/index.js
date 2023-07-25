//get server setup
import app from './server.js'

//additional imports
import mongodb from 'mongodb'
import dotenv from 'dotenv'

//import DAO
import RecipeDAO from './DAO/recipes.DAO.js'
import UserDAO from './DAO/users.DAO.js'

//load environmental variables
dotenv.config()

//create client for DB access
const MongoClient = mongodb.MongoClient

//establish prot
const port = process.env.PORT || 8000

//establish database connection
MongoClient.connect(
    process.env.MONGODB_URI,
    {
        wtimeoutMS:2500,
        useNewUrlParser:true,
    }
)
.catch(err=>{
    console.error(err.stack)
    process.exit(1)
})
.then(async client =>{

    await RecipeDAO.injectDB(client)
    await UserDAO.injectDB(client)

    app.listen(port,()=>{
        console.log(`view on http://localhost:${port}/api/v1/`)
    })
})
