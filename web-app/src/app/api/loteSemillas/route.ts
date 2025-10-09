import { NextRequest, NextResponse } from "next/server";
import * as grpc from "@grpc/grpc-js";
import load from 'js-yaml';
import fs from 'fs';
import cripto from 'crypto';
import { connect, signers } from '@hyperledger/fabric-gateway';

export interface IdataAlmacenar {
    agricultor: string;
    fecha_compra: string;

}

export function POST(request: NextRequest) {

}

export async function GET(request: NextRequest) {
    try {
        const organizationDir = "../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com";
        const identityCertFile = fs.readFileSync(`${organizationDir}/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem`, 'utf8');
        // Get tsl certificate
        const tlsCertFile = fs.readFileSync(`${organizationDir}/peers/peer0.org1.example.com/tls/ca.crt`, 'utf8');
        const peerHostAlias = "peer0.org1.example.com";

        // Get private key as buffer
        const privKeyFile = fs.readFileSync(`${organizationDir}/users/User1@org1.example.com/msp/keystore/priv_sk`, 'utf8');
        const prvKeyBuffer = Buffer.from(privKeyFile)

        // Create private key
        const privKey = cripto.createPrivateKey(prvKeyBuffer);

        // Cerate a signer 
        const signer = signers.newPrivateKeySigner(privKey);


        // Create a grpc connection
        const client = new grpc.Client(
            'localhost:7051',
            grpc.credentials.createSsl(Buffer.from(tlsCertFile)), {
            'grpc.ssl_target_name_override': peerHostAlias,
        }
        )

        // Create a identity
        const identity = {
            mspId: "Org1MSP",
            credentials: Buffer.from(identityCertFile, "utf8"),
        }

        // Nos conectamos a la red
        const gateway = connect({
            client,
            identity,
            signer
        })

        // Obtenemos el canal
        const channel = gateway.getNetwork("my-channel");
        // Obtenemos el chaincode
        const contract = channel.getContract("traza-fresas", "loteSemillasC");
        // Ejecutamos una tx
        const res = await contract.submitTransaction('suma', "8", "2");
        return NextResponse.json(Buffer.from(res).toString('utf-8'), { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 })
    }
}