#!/bin/bash
# ---------------------------------------------------------
#   Configración inicial del script
# ---------------------------------------------------------
DEBUG=false

# ---------------------------------------------------------
#   Configuración del canal
# ---------------------------------------------------------
CHANNEL_NAME="my-channel"
# ---------------------------------------------------------
#   Configuración del ccaas
# ---------------------------------------------------------
CHAINCODE_NAME="traza-fresas"
CHAINCODE_LANG="typescript"
# Path to chaincode from inside "fabric-samples/test-network"
CHAINCODE_PATH="../../ccaas/"
# ---------------------------------------------------------
#   Configuración de Fabric samples
# ---------------------------------------------------------
FABRIC_SAMPLES_DIR="../fabric-samples/test-network"
cd "$FABRIC_SAMPLES_DIR"
# ---------------------------------------------------------
#   Limpieza inicial 
# ---------------------------------------------------------
echo "🤖: 🧹 Iniciando limpeza del espacio de trabajo..."
#   Eliminar contenedores de chaincode
echo $(docker ps -a -q --filter "name=$CHAINCODE_NAME" | xargs -r docker rm -f)
#   Eliminar red previamente existente 
./network.sh down
echo "🤖: ✅ Limpieza completada."

# ---------------------------------------------------------
#   Iniciar red y crear canal
# ---------------------------------------------------------
echo "🤖: 🛠️ Levantando red y creando canal $CHANNEL_NAME..."
./network.sh  up createChannel -c "$CHANNEL_NAME"
echo "🤖: ✅ Red y canal creados con éxito."

# ---------------------------------------------------------
#   Deploy del ccaas
# ---------------------------------------------------------
echo "🤖: ⭐ Iniciando deploy del CCAAS $CHAINCODE_NAME"
./network.sh deployCCAAS -c $CHANNEL_NAME -ccn $CHAINCODE_NAME -ccp $CHAINCODE_PATH -ccl $CHAINCODE_LANG
echo "🤖: ✅ El deploy del chaincode se tenminó con éxito."

# ---------------------------------------------------------
#   Mesaje de despedida exitosa
# ---------------------------------------------------------
echo -e "
     ◉   ----    ◉
     |---------- |
    /             \     -------------------------------------
    |    ◯   ◯    |     ★ Red lista para crear algo geniaaal.
    |     ___     |     -------------------------------------
    -------------
        |     |
---\---------------/---
|   |  ▣    • ○ ● |   |
"