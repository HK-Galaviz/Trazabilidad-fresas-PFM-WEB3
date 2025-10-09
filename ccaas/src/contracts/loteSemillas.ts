import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Iidentity } from '../interfaces';
import { getRol, verify } from '../utils';


@Info({
    title: 'LoteSemillasContrato',
    description: 'Maneja todas las transacciones relacionadas con el asset loteSemillas.'
}) 
export class loteSemillasC extends Contract {
    @Transaction()
    @Returns('string')
    async almacenar_lote_semillas(ctx: Context, identity: Iidentity, args: {
        lote: number,
        fecha_compra: Date;
        variedad: string,
        agricultor: string,
        condiciones_almacenamiento: {
            temp_celsius: number,
            hum: number
        },
    }) {
        const userOk = verify(identity);
        if (!userOk) {
            return false;
        }

        const role = await getRol(ctx, identity.metamask_address);
        if (role != "agricultor") {
            return false;
        }

        ctx.stub.putState(`loteSemillas/${args.agricultor}/${args.variedad}/${args.lote}`, Buffer.from(JSON.stringify({
            lote: args.lote,
            fechaCompra: args.fecha_compra.toISOString,
            variedad: args.variedad,
            agricultor: args.agricultor,
            condicionesAlmacenamiento: args.condiciones_almacenamiento,
        })));
        return true;
    }

    @Transaction()
    @Returns('string')
    async sembrar_lote_semillas(ctx: Context, identity: Iidentity) {

    }

    async suma(ctx: Context,  num1: string, num2: string ) {
        return Number(num1) + Number(num2);
    }
}