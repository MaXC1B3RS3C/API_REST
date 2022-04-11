#inicializar proyecto de node


npm init -y 


#instalar paquete nodemon md5 express sqlite3 body-parser y https


npm install nodemon md5 express sqlite3 body-parser https

#adicional a nodemon


npm install --save-dev nodemon

#solventar errores de seguridad o actualizar el paquete node-gyp de sqlite3

npm install -g node-gyp

#instalar Chocolatey en una terminal powershell administrador


Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

#instalar mkcert en Chocolatey en una terminal powershell administrador


choco install mkcert

#instalar mkcert


mkcert -install 

#crear un certificado para el host (en nuestro caso localhost)


mkcert localhost 127.0.0.1 ::1

#ejecutar el proyecto de node


npm start run

#Ofuscar un archivo js:
https://obfuscator.io/
