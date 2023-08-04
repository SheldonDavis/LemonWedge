//get server setup
import app from './server.js'

//additional imports
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import http from 'http'

//import DAO
import RecipeDAO from './DAO/recipes.DAO.js'
import UserDAO from './DAO/users.DAO.js'
import MealplanDAO from './DAO/mealplan.DAO.js'

//load environmental variables
dotenv.config()

//create client for DB access
const MongoClient = mongodb.MongoClient

//establish prot
const port = process.env.PORT || 8000


//establish database connection
MongoClient.connect(
    process.env.MONGODB_URI,
    // process.env.MONGODB_URI_CLOUD,
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
    await MealplanDAO.injectDB(client)

    // console.log(port)


    http.createServer(app).listen(app.get('port'), app.get('host'), function(){
        console.log("Express server listening on port " + `http://${app.get('host')}/${app.get('port')}`);
    });

    app.listen(port,()=>{
        console.log(`view on http://localhost:${port}/api/v1/`)
    })
})
