/*
    Estructura para las claves del asset: 
    “usuario”/rol/address
*/

import { Object, Property } from "fabric-contract-api";

@Object()
export class Usuario {
    @Property()
    public metamask_address: string = '';
    @Property()
    public nombre_completo: string = '';
    @Property()
    public rol: string = '';
}
