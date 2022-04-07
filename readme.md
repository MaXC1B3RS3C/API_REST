npm init -y 

<!-- instalar paquete nodemon md5 express sqlite3 body-parser-->
npm install nodemon md5 express sqlite3 body-parser 

<!-- adicional a nodemon-->
npm install --save-dev nodemon

<!-- instalar paquete npm https para securizar la conexión-->
npm install https

<!-- instalar Chocolatey en una terminal powershell administrador:-->
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

<!-- instalar OpenSSL.Light en Chocolatey en una terminal powershell administrador:-->
choco install OpenSSL.Light

<!-- instalar mkcert en Chocolatey en una terminal powershell administrador:-->
choco install mkcert

<!-- instalar mkcert:-->
mkcert -install 

<!-- crear un certificado para el host (en nuestro caso localhost)-->
mkcert localhost 127.0.0.1 ::1

<!--ejecutar el proyecto de node-->
npm start run
----------------
<!--Obfuscate a js file:
cd node-modules/bin/javascript-obfuscator/ client/js/onsubmit-event.js
