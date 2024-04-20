import { Apu } from './service/apu.service';
import { Documento } from './types';

export const Declarar = (data: Documento[]) => {
    const service = new Apu(data)
    return new Promise((resolve, reject) => {
        service.getRta()
            .then((rta: any) => {
                resolve(rta);
            })
            .catch((error: any) => {
                reject(error);
            })
    })
}
