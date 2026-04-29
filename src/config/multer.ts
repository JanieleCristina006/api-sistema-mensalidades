import multer from "multer";
import { AppError } from "../errors/appError";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Só é permitido enviar arquivos de imagem.",
          400,
          "TIPO_ARQUIVO_INVALIDO"
        )
      );
    }
  },
});
