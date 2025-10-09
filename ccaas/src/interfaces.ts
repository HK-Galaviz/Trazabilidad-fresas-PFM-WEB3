export const roles: string[] = [
    'admin',
    'agricultor',
    'responsableCosecha',
    'centroEmpaque',
    'transportista',
    'distribuidor',
    'minorista'
]


export interface Iidentity {
    metamask_address: string;
    message: string;
    signed_message: string;
}