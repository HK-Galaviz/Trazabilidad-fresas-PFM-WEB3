import { Contract, Context, Info, Transaction, Returns } from 'fabric-contract-api'
import { Iidentity, roles } from '../interfaces';
import { Usuario } from '../assets/usuario';
import { getRol } from '../utils';
import { buffer } from 'stream/consumers';

@Info({
    title: 'UsuarioContrato',
    description: 'Maneja todas las transacciones relacionadas con el asset Usuario, por ejemplo registro y eliminación.',
})
export class UsarioC extends Contract {
    // Funciones auxiliares
    private construirClaves(ctx: Context, metamask_address: string, rol: string): string {
        return ctx.stub.createCompositeKey("usuario", [rol, metamask_address]);
    }

    @Transaction()
    @Returns('Boolean')
    public async getUsuarioByAddr(ctx: Context, metamask_address: string): Promise<Usuario | null> {
        let exists = false;
        // ¿Se esperará a que se cumplan las funciones asíncronas del forEach?
        roles.forEach(async (rol: string) => {
            const key = ctx.stub.createCompositeKey("usuario", [rol, metamask_address]);
            const buffer = await ctx.stub.getState(key);
            exists = buffer && buffer.length > 0;
        })
        if (exists) {
            return JSON.parse(buffer.toString()) as Usuario
        } else { return null }
    }




    async registrar(ctx: Context, identity: Iidentity, metamask_address: string, rol: string, nombre_completo: string) {
        // Validar que usuario sea admin
        getRol(ctx, metamask_address)

        // Contruír las claves para el asset
        const claves = this.construirClaves(ctx, metamask_address, rol);

        // Verificar si el usuario ya existe


        // 
    }
}