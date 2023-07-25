
import { render } from '@react-email/render'

//middleware
import SendMail from '../../middleware/sendEmail.MW.js'

//templates
// import Welcome from '../../emailTemplates/Welcome.jsx'
import Welcome from '../../emailTemplates/Welcome.js'

 const MailController={
    //default -- testing
    apiPostSendMail:async function(req,res,next){
        try{
            const {tomail} = req.body
            const response = await SendMail(tomail)
            // console.log(response)
            console.log('email sent')
            res.json({status:'success'})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    },   

    //sends welcome email
    apiPostSendWelcome:async function(req,res,next){        
        try{
            const {tomail} = req.body
            const emailHtml = render(Welcome());
            const options = {
                tomail:tomail,
                subject:'Welcome to LemonWedge',
                html: emailHtml,
            }
            const response = await SendMail(options)
            console.log(response)

            // console.log('email sent')
            res.json({status:'success'})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    },
    
    //send email on account information update
    apiPostSendAccountUpdate: async function(req, res, next){
        try{

        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    //MORE TO COME??


}
export default MailController