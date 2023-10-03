import express from 'express'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

//middleware
import credentials from './middleware/credentials.MW.js'

//config
import corsOptions from './config/corsOptions.js'

//routes
import recipes from './api/routes/recipes.routes.js'
import users from './api/routes/users.routes.js'
import mailer from './api/routes/mail.routes.js'
import mealplan from './api/routes/mealplan.routes.js'

const app = express()

app.set('port', process.env.PORT || 8000);
//app.set('host', '192.168.1.151');

//URL whitelist so external access cannot be established
app.use(credentials)
app.use(cors(corsOptions))

//raise limit to allow for image upload
app.use(bodyParser.json({limit: '1.5MB'}))//limit to be determined

//connect to frontend build
const __dirname = dirname(fileURLToPath(import.meta.url))
const buildPath = path.join(__dirname, '../frontend/build')
app.use(express.static(buildPath))

//allow for express use of JSON
app.use(express.json())


//parse cookies for credential verification
app.use(cookieParser())

//available API paths
app.use('/api/v1/recipes', recipes)
app.use('/api/v1/users', users)
app.use('/api/v1/sendMail', mailer)
app.use('/api/v1/mealplan', mealplan)

app.get('*', (req,res)=>{
    res.sendFile(path.join(buildPath, 'index.html'))
})

//show 404 if attempting to access elsewhere
app.use('*', (req,res)=>res.status(404).json({error:'This request is unavailable.'}))

export default app 



