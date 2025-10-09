import * as grpc from "@grpc/grpc-js";
import load from 'js-yaml';
import fs from 'fs';
import cripto from 'crypto';
import { connect, signers } from '@hyperledger/fabric-gateway';

export const main = async () => {
    const organizationsDir = "../../../fabric-samples/test-network/peerOrganizations";
    const identityCertFile = fs.readFileSync(`${organizationsDir}/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem`, 'utf8');
    // Get tsl certificate
    const tlsCertFile = fs.readFileSync(`${organizationsDir}/org1.example.com/peers/peer0.org1.example.com/tls/server.crt`, 'utf8');


    // Get private key as buffer
    const privKeyFile = fs.readFileSync(`${organizationsDir}/users/User1@org1.example.com/msp/keystore/priv_sk`, 'utf8');
    const prvKeyBuffer = Buffer.from(privKeyFile)

    // Create private key
    const privKey = cripto.createPrivateKey(prvKeyBuffer);

    // Cerate a signer 
    const signer = signers.newPrivateKeySigner(privKey);


    // Create a grpc connection
    const client = new grpc.Client(
        'http://localhost:5435',
        grpc.credentials.createSsl(Buffer.from(tlsCertFile)),
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
    const chaincode = channel.getContract("loteSemillasC");
    // Ejecutamos una tx
    chaincode.submitTransaction('suma', "1", "2");
}

main().then(()=> console.log("OK")).catch((error)=>console.log(error))