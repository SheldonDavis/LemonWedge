import nodemailer from 'nodemailer'

async function SendMail(options){    
    try{
        const {tomail, subject, html,} = options
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: tomail,
            subject: subject,
            html: html,
        }

        const response =  await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })

        return response

    }catch(e){
        console.error(`unable to send email: ${e}`)
        return {error: e}
    }

}
export default SendMail
