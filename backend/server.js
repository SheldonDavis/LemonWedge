import express from 'express'
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

const app = express()

//URL whitelist so external access cannot be established
app.use(credentials)
app.use(cors(corsOptions))

//raise limit to allow for image upload
app.use(bodyParser.json({limit: '1.5MB'}))//limit to be determined

//allow for express use of JSON
app.use(express.json())

//parse cookies for credential verification
app.use(cookieParser())

//available API paths
app.use('/api/v1/recipes', recipes)
app.use('/api/v1/users', users)
app.use('/api/v1/sendMail', mailer)

//show 404 if attempting to access elsewhere
app.use('*', (req,res)=>res.status(404).json({error:'This request is unavailable.'}))

export default app 



