import "dotenv/config";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { supabase } from "../../config/supabase";

interface CreateAdminProps {
  nome: string;
  email: string;
  senha: string;
  file: Express.Multer.File;
}

interface UploadImageProps {
  file: Express.Multer.File;
}


export class CreateAdminService {

  async uploadImagem({ file }:UploadImageProps){
    if(!file){
      throw new Error("Arquivo não enviado!")
    }
    const fileName = `admin-${Date.now()} - ${file.originalname}`;

    const { data,error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(fileName,file.buffer,{
        contentType: file.mimetype
    });

    if(error){
      throw new Error(error.message);
    }

    const { data:publicUrl } = supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .getPublicUrl(data.path);

    return {
      url: publicUrl.publicUrl
    }



  }

  async execute({ nome, email, senha,file }: CreateAdminProps) {
    const passwordencryption = await bcrypt.hash(senha, 10);
    //console.log(`Senha criptografada: ${passwordencryption}`);

    const image = await this.uploadImagem({file})

    const existEmail = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (existEmail) {
      throw new Error("Email já cadastrado!");
    }

    const createAdm = await prisma.admin.create({
      data: {
        nome: nome,
        avatar: image.url,
        email: email,
        senha: passwordencryption,
      },
    });

    const payload = {
      id: createAdm.id,
      nome: createAdm.nome,
      email: createAdm.email,
      senha: createAdm.senha
    };

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET não definido");
    }

    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, secretKey, options);

    return {
        token: `${token}`
    };
  }
}
