
export type Item = {
    CodigoItem: string
    Descripcion: string
    Cantidad: number
    Unidad: string
    Igv: number
    Precio: number
    SubTotal: number
    Total: number
    Descuento: number
    Lote: string
    FechaVcto: string
    Labora: string
    Pastilla: null | string
    Palote: null | string
}

export type Cuota = {
    MontoCuota: string,
    FechaCuota: string,
    NroCuota: string
}

export type Documento = {
    CORRELATIV: string
    items: Item[]
    HoraReferencia:null
    cuotas: Cuota[]
    cliente: string
    NroDocCliente: string
    TipoDocCliente: string
    DirCliente: string
    TipoDoc: string
    CodVenta: string
    Serie: string
    Correlativo: string
    FechaEmision: string
    HoraEmision: string
    FechaVencimiento: string
    Moneda: string
    FormaPago: string
    Base: number
    Igv: number
    MontoExcento: number
    MontoGratuito: number
    Descuento: number
    TotalDocumento: number
    Porcentaje: number
    NGuia: number
    TipoCambio: number
    FechaReferencia: null | string
    TipoReferencia: null | string
    DocumentoReferencia: null | string
    CodMotivo: null | string,
    Motivo: null | string
    otros: string
    Detraccion: number
    PorcDetraccion: number
    MontoDetraccion: number
    RegimenPercepcion: number
    TasaPercepcion: number
    MontoPercepcion: number
    ruc: string
    idSucursal: number
    Estado: number
    leyenda: string
    Vendedor: string
    archivoPath?: string
    archivo?: string
    placa: null | string
}

export type RespuestaServicio = {
    estatus: number
    Message: string
    documento: string
}