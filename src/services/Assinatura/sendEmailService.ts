import "dotenv/config";
import { transporter } from "../../config/mail";

export class SendEmailService {
     
     async sendEmail(to: string,subject: string,text:string){
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
          })
     }
}
