import "dotenv/config";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

interface LoginProps{
    email: string,
    senha: string
}

export class LoginService{
    async execute({ email,senha }:LoginProps){

        const user = await prisma.admin.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new Error("Email ou senha inválidos")
        }

        const passwordValid = await bcrypt.compare(senha,user.senha);

        if(!passwordValid){
            throw new Error("Email ou senha inválidos")
        }

        const payload = {
            id: user.id,
            email: user.email
        }

        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            throw new Error("JWT_SECRET não definido");
        }

        const options: SignOptions = {
            expiresIn: "1h",
        };

        const token = jwt.sign(payload, secretKey, options);

        return{
            token: `${token}`
        }
    }
}