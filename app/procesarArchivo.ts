import fs from 'fs';
import { idSucursal, ruc } from './config/config';
import { Documento } from './types';

const reordenarFecha = (fecha: string) => {
    const fecha_reordenado = fecha.split("-");

    return `${fecha_reordenado[2]}-${fecha_reordenado[1]}-${fecha_reordenado[0]}`;
}

const ValidarFecha = (data: string) => {
    let fecha_corregida = data;
    if (data.includes("/")) {
        fecha_corregida = data.replaceAll("/", "-");
        const fecha_r = reordenarFecha(fecha_corregida);
        fecha_corregida = fecha_r
    }
    if (data.includes(".")) {
        fecha_corregida = data.replaceAll(".", "-")
        const fecha_r = reordenarFecha(fecha_corregida);
        fecha_corregida = fecha_r
    }
       
    return fecha_corregida;
}

export const ProcesarArchivo = (archivoPath: string) => {
    const data = fs.readFileSync(archivoPath, 'utf8');
    const lines = data.split('\n');

    const venta: Documento = {
        cliente: "",
        NroDocCliente: "",
        TipoDocCliente: "",
        DirCliente: "",
        TipoDoc: "",
        CodVenta: "",
        Serie: "",
        Correlativo: "",
        FechaEmision: "",
        HoraEmision: "",
        FechaVencimiento: "",
        items: [],
        cuotas: [],
        Moneda: "",
        FormaPago: "",
        Base: 0,
        Igv: 0,
        MontoExcento: 0,
        MontoGratuito: 0,
        Descuento: 0,
        TotalDocumento: 0,
        Porcentaje: 18,
        NGuia: 0,
        TipoCambio: 0,
        FechaReferencia: null,
        TipoReferencia: null,
        DocumentoReferencia: null,
        CodMotivo: null,
        Motivo: null,
        otros: "",
        Detraccion: 0,
        PorcDetraccion: 0,
        MontoDetraccion: 0,
        RegimenPercepcion: 0,
        TasaPercepcion: 0,
        MontoPercepcion: 0,
        ruc: "",
        idSucursal: idSucursal,
        Estado: 1,
        leyenda: "",
        Vendedor: "",
        CORRELATIV: "",
        placa: null,
        HoraReferencia: null
    };

    for (let i = 0; i < lines.length; i++) {

        const fields = lines[i].split('|');
        console.log({ fields });
        switch (fields[0]) {
            case '01':
                venta.ruc = ruc;
                venta.TipoDoc = fields[6];
                venta.CORRELATIV = `${fields[7]}-${fields[8]}`;
                venta.CodVenta = `${fields[7]}-${fields[8]}`;
                venta.Serie = fields[7];
                venta.Correlativo = fields[8];
                venta.FechaEmision = fields[4];
                venta.HoraEmision = fields[5];
                venta.FechaVencimiento = fields[4];
                venta.TipoDocCliente = fields[11];
                venta.NroDocCliente = fields[12];
                venta.cliente = fields[13];
                venta.DirCliente = fields[14].replace("\ufffd292"," ");
                venta.Moneda = fields[15];
                venta.Base = parseFloat(fields[16]);
                venta.Igv = parseFloat(fields[17]);
                venta.TotalDocumento = parseFloat(fields[19]);
                venta.MontoExcento = parseFloat(fields[20]);
                venta.MontoGratuito = parseFloat(fields[21]);
                venta.leyenda = fields[22];
                venta.Porcentaje = parseFloat(fields[23]);
                break;
            case '02':
                venta.Vendedor = fields[1];
                venta.FormaPago = fields[2];
                break;
            case '03':
                const items = {
                    CodigoItem: fields[1],
                    Descripcion: fields[2],
                    Cantidad: parseFloat(fields[3]),
                    Unidad: fields[4],
                    // baseItem: parseFloat(fields[5]),
                    Igv: parseFloat(fields[6]),
                    Precio: parseFloat(fields[7]),
                    SubTotal: parseFloat(fields[5]),
                    Total: parseFloat(fields[9]),
                    Descuento: parseFloat(fields[10]),
                    Lote: fields[11],
                    FechaVcto: ValidarFecha(fields[12]),
                    Labora: fields[13],
                    Pastilla: null,
                    Palote: null
                };

                venta.items.push(items);
                break;
            case '04':
                const cuotas = {
                    MontoCuota: fields[3],
                    FechaCuota: fields[2],
                    NroCuota: fields[1],
                }
                venta.cuotas.push(cuotas);

        }
    }
    // console.log(venta);
    return venta;
    // throw new Error("Error para parar tooo");
}
