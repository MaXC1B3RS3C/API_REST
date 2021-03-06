// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

//importar md5
var md5 = require("md5")

// body-parser settings
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 9000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Servidor escoltant a l'adreça http://localhost:%PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});


// Insert here other API endpoints

//Users endpoint - Obtindre llista d'usuaris
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});
// id - endpoint - Obtindre un usuari per id
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = " + req.params.id
    db.get(sql, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
        }else{
            res.json({
                "message":"success",
                "data":row
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
// body-parser endpoint
app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        //password : req.body.password
        //Actulitze el metode md5 de password
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})
// actualitzar un usuari donat el seu id
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE user set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
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
app.get("/api/user/delete/:id", (req, res, next) => {
    var sql = "delete from user where id = " + req.params.id
    db.get(sql, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
        }else{
            res.json({
                "message":"success",
                "data":row
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
app.use(function (req, res) {
    res.status(404).json({ "error": "Invalid endpoint" });
});
