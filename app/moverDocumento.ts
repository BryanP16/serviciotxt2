import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const MoverDocumento = (archivoPath: string | undefined, archivo: string | undefined, carpeta = "sent") => {

    const id = uuidv4();

    if (archivoPath == undefined || archivo == undefined) {
        return console.log("El nombre de archivo no se a encontrado posible error procesarArchivo");
    }

    fs.rename(archivoPath, `${__dirname}/${carpeta}/${id}-${archivo}`, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('El archivo ha sido movido exitosamente!');
    });
}