import express from 'express';
import { carpeta, idSucursal, puerto, ruc, tiempo, tiempo_limpiar, documentos_enviar } from './config/config';
import { Declarar } from './declarar';
import { LeyendoArchivos } from './leerArchivos';
import { MoverDocumento } from './moverDocumento';
import { Documento, RespuestaServicio } from './types';
import axios from 'axios';

const app = express();
let mock: Documento[] = []
let mockDocumentosErrores: Documento[] = [];

const LimpiarErrores = () => {
    mockDocumentosErrores = [];
}

const ValidarInformacion = (data: Documento[]) => {
    /*mockDocumentosErrores.map(docError => {
        const docIndex = data.findIndex(docData => docData?.CodVenta == docError?.CodVenta)
        data.splice(docIndex, 1);
    })
    return data*/
    const documentos_pendientes = data.filter((documento) => !mockDocumentosErrores.includes(documento));
    return documentos_pendientes.slice(0, documentos_enviar);
}

setInterval(() => {
    LeyendoArchivos(carpeta)
        .then((data: Documento[]) => {
            const dataEnvio = ValidarInformacion(data);
            mock = dataEnvio;

            if (dataEnvio.length != 0) {
                console.log("Ejecutando")
                Declarar(dataEnvio)
                    .then((rta: any) => {
                        const { data } = rta;
                        console.log(data);

                        data.map((documento: RespuestaServicio) => {

                            const indexDoc = dataEnvio.findIndex(documentoMock => `${documentoMock.CodVenta.trim()}-${documentoMock.TipoDoc.trim()}` == documento.documento.trim())
                            console.log(indexDoc);
                            const documentoMover = dataEnvio[indexDoc];
                            if (documento.estatus == 1) {
                                console.log(`El documento ${documento.documento} sera movido procesado exitosamente`)
                                MoverDocumento(documentoMover.archivoPath, documentoMover.archivo);
                            } else {
                                console.log(`El documento ${documento.documento} contiene errores`)
                                mockDocumentosErrores.push(dataEnvio[indexDoc])
                                MoverDocumento(documentoMover.archivoPath, documentoMover.archivo, "error");
                            }

                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        })
        .catch((error: Error) => {
            console.log(error);
        });

}, tiempo)

setInterval(LimpiarErrores, tiempo_limpiar)


const ValidateTime = (fecha: string) => {
    const date = fecha.split("/");
    return `${date[2]}-${date[0].padStart(2, "0")}-${date[1].padStart(2, "0")}`;
};

setInterval(async () => {
    try {
        const rta = await axios.post(
            "http://cpe.apufact.com/portal/public/api/MonitoreoServicioApuFact",
            [
                {
                    ruc: ruc,
                    idSucursal: idSucursal,
                    Fecha: `${ValidateTime(
                        new Date().toLocaleDateString().substring(0, 10)
                    )}-${new Date().toLocaleTimeString().substring(0, 8)}`,
                },
            ]
        );

        console.log(rta.data);
        console.log({
            Fecha: `${ValidateTime(
                new Date().toLocaleDateString().substring(0, 10)
            )}-${new Date().toLocaleTimeString().substring(0, 8)}`
        })
    } catch (error) {
        console.log(error);
    }
}, 300000);



/**Route */
app.listen(puerto, () => {
    console.log("SERVICIO DE TXT INICIADO");
    console.log("Server iniciado");

    app.get('/procesados', (req, res) => {
        LeyendoArchivos(`${__dirname}/sent`)
            .then(rta => {
                res.send({
                    info: "documentos leidos",
                    data: rta
                })
            })
            .catch(erro => {
                res.send({
                    error: true,
                    message: erro
                })
            })
    })

    app.get('/procesando', (req, res) => {
        res.send({ data: mock });
    })

    app.get('/errores', (req, res) => {
        res.send({
            info: 'Documentos con errores',
            data: mockDocumentosErrores
        })
    })
})
