import { Context } from "fabric-contract-api";
import { Iidentity } from "./interfaces";
import { ethers } from "ethers";

export async function getRol(ctx: Context, metamask_address: string) {
    const userIterator = await ctx.stub.getStateByPartialCompositeKey("addrUsuario", [metamask_address]);
    const res = await userIterator.next()
    if (res.value && res.value.key) {
        const role = JSON.parse(res.value.value.toString()).role;
        return role.toString();
    } else {
        return null;
    }
}

export function verify(identity: Iidentity) {
    const actualAddress = ethers.verifyMessage(identity.message, identity.signed_message);
    if (actualAddress.toLowerCase !== identity.metamask_address.toLowerCase) {
        return false;
    } else return true;
}

export function validarNoVacio(valor: string): boolean {
    if (!valor || valor.trim() === "") {
        return false;
    }
    return true;
}