// Create express app
var db = require("./database.js")
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const jwtsecret = require('crypto').randomBytes(64).toString('hex')
require("dotenv").config();	
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//importar md5
var md5 = require("md5")
// body-parser settings
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
// Vax a afegir un path de un fitxer html per a afegir 
//el formulari que es troba en la part del client.
const path = require('path')
//const serverToken=jwt.sign(username, process.env.jwtsecret, { expiresIn: '1800s' });	
//res.cookie(serverToken);
//res.redirect('/content')
//Función flecha para la autenticación del token
const auth = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
	  return res.sendStatus(403);
	}
	try {
	  const data = jwt.verify(token,jwtsecret);
	  req.userId = data.id;
	  req.userRole = data.role;
	  return next();
	} catch {
	  return res.sendStatus(403);
	}
  };
// Root endpoint
app.get("/", (req, res) => {
	res.redirect("/loginform")
});
//Aqui añado la parte del formulario para añadir los usuarios
//Relativo al app.post para crear usuarios
//Le quitare el "auth" a los endpoints de usuario para poder seguir consultando usuarios sin la cookie
app.get('/userform', (req, res) => {
	res.sendFile(path.join(__dirname, './client/postuser.html'))
})
// Aqui añado la parte del formulario para loggear a usuarios
app.get('/loginform', (req, res) => {
	res.sendFile(path.join(__dirname, './client/login.html'))
})
//Endpoint POST para el login, cookies y jsonwebtoken
app.post("/login", (req, res) => {
	var errors = []
	if (!req.body.password) {
		errors.push("No password specified");
	}
	if (!req.body.email) {
		errors.push("No email specified");
	}
	if (errors.length) {
		res.status(400).json({
			"error": errors.join(",")
		});
		return;
	}
	var data = {
		name: req.body.name,
		email: req.body.email,
		//password : req.body.password
		//Actualizo el metodo md5 de las contraseñas (falta incorporar bcrypt)
		password: req.body.password
	}
	var sql = "select * from user where name=? AND email = ? AND password = ? LIMIT 1"
	var params = [data.name, data.email, data.password]
	db.get('select * from user where name=?', params[0], function(err, row) {
		if (!row) return res.send("No se ha encontrado el usuario");
		if(err) return res.send("Error al iniciar sesión");
		db.get('select * from user where name=? AND email = ? AND password = ? LIMIT 1', params[0], params[1],params[2], function(err, row) {
		  if (!row) return res.send("Las credenciales no coinciden.");
		  if(err) return res.send("Error al iniciar sesión");
		  const token = jwt.sign({ id: 1, role: "ADMIN" }, jwtsecret);
			return res
			.cookie("access_token", token, {
			  httpOnly: true,
			  secure: process.env.NODE_ENV === "production",
			})
			.status(200)
			.redirect('/content')
		});

		
	});
});


// Endpoint de logout (destroy a cookie)
app.get("/logout", auth, (req, res) => {
	return res
		.clearCookie("access_token")
		.status(200)
		.json({
			message: "Se cerró la sesión con exito "
		});
});
app.get('/content', auth, (req, res) => {
	res.sendFile(path.join(__dirname, './client/content.html'))
})
//Users endpoint - Obtindre llista d'usuaris
//Le quitare el "auth" a los endpoints de usuario para poder seguir consultando usuarios sin la cookie
app.get("/api/users", (req, res, next) => {
	var sql = "select * from user"
	var params = []
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		res.json({
			"message": "success",
			"data": rows
		})
	});
});
// id - endpoint - Obtindre un usuari per id
app.get("/api/user/:id", auth, (req, res, next) => {
	var sql = "select * from user where id = " + req.params.id
	db.get(sql, (err, row) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
		} else {
			res.json({
				"message": "success",
				"data": row
			})
		}
	});
});
//MATEIX ENDPOINT PARAMETRIZAT Y NO VULNERABLE A SQL-INJECTION
//app.get("/api/user/:id", (req, res, next) => {
// METODE NO SEGUR var sql = "select * from user where id = " + req.params.id
//SQLI NO VULNERABLE
//var sql = "select * from user where id = ?"
//var params=[req.params.id]
//db.get(sql, params (err, row) => {
//    if (err) {
//      res.status(400).json({"error":err.message});
//    }else{
//       res.json({
//            "message":"success",
//            "data":row
//            "id"
//       })
//    }
//  });
//});
// body-parser endpoint - endpoint de creació de usuari
//Le quitare el "auth" a los endpoints de usuario para poder seguir consultando usuarios sin la cookie
app.post("/api/user/", auth, (req, res, next) => {
	var errors = []
	if (!req.body.password) {
		errors.push("No password specified");
	}
	if (!req.body.email) {
		errors.push("No email specified");
	}
	if (errors.length) {
		res.status(400).json({
			"error": errors.join(",")
		});
		return;
	}
	var data = {
		name: req.body.name,
		email: req.body.email,
		//password : req.body.password
		//Actulitze el metode md5 de password
		password: md5(req.body.password)
	}
	var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
	var params = [data.name, data.email, data.password]
	db.run(sql, params, function(err, result) {
		if (err) {
			res.status(400).json({
				"error": err.message
			})
			return;
		}
		res.json({
			"message": "success",
			"data": data,
			"id": this.lastID
		})
	});
})
// actualitzar un usuari donat el seu id
app.patch("/api/user/:id", auth, (req, res, next) => {
	var data = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password ? md5(req.body.password) : null
	}
	db.run(
		`UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
		[data.name, data.email, data.password, req.params.id],
		function(err, result) {
			if (err) {
				res.status(400).json({
					"error": res.message
				})
				return;
			}
			res.json({
				message: "success",
				data: data,
				changes: this.changes
			})
		});
})
//Eliminar un usuari per ID -  EJERCICI 6
// id - endpoint - Eliminar un usuari per id (MEUA)
app.get("/api/user/delete/:id", auth, (req, res, next) => {
	var sql = "delete from user where id = " + req.params.id
	db.get(sql, (err, row) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
		} else {
			res.json({
				"message": "success",
				"data": row
			})
		}
	});
});
//SI PARAMETRITZEM EL MEU ENDPOINT ANTERIOR SERÍA SEGURA A SQL-INJECTION
//> SOLUCIÓ DE CLASE AMB EXPRESS de endpoint app.delete
//app.delete("/api/user/:id"),(req,res,next)=>{
//       db.run(
//        'DELETE FROM user WHERE id = ?',
//        req.params.id,
//        function (err, result) {
//            if (err){
//                res.status(400).json({"error": res.message})
//                return;
//            }
//            res.json({
//                message: "success",
//                data: data,
//                changes: this.changes
//            })
//    });
//};
app.use(function(req, res) {
	res.status(404).json({
		"error": "Invalid endpoint"
	});
});
// Server port
var HTTP_PORT = 9000

// Start server

//Para generar las claves en powershell e iniciar el servidor
//Con express y https.createServer
//Realizar comando mkcert para crear certificados 
//Puede ser diferente en producción
const server = https.createServer({
	key: fs.readFileSync('./certs/localhost+2-key.pem'), // path to localhost+2-key.pem
	cert: fs.readFileSync('./certs/localhost+2.pem'), // path to localhost+2.pem
	requestCert: false,
	rejectUnauthorized: false,
}, app).listen(HTTP_PORT, function() {
	console.log("Servidor escoltant a l'adreça https://localhost:%PORT%".replace("%PORT%", HTTP_PORT))
});