import fs from 'fs';
import path from 'path';
import { Documento } from './types';
import { ProcesarArchivo } from './procesarArchivo';

export const LeyendoArchivos = (carpeta: string): Promise<Documento[]> => {
    const archivosEnviar: Documento[] = [];

    return new Promise((resolve, reject) => {
        fs.readdir(carpeta, (error, archivos) => {

            if (error) {
                console.error(`Error al leer la carpeta ${error}`);
                reject('Error al leer carpeta' + error)
                return;
            }

            archivos.forEach(archivo => {

                const archivoPath = path.join(carpeta, archivo);

                console.log(`Procesando archivo ${archivo}`);
                const venta = ProcesarArchivo(archivoPath);
                archivosEnviar.push({ ...venta, archivoPath, archivo });
                // Registrar el archivo como procesado
            })

            resolve(archivosEnviar)
        })
    })
}