const express = require('express');
const app = express();
require("dotenv").config();
// const port = 3001;
var md5 = require('md5')
var sqlite3 = require('sqlite3').verbose()
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const DBSOURCE = "usersdb.sqlite";
const auth = require("./middleware");

var path = require('path')
var serveStatic = require('serve-static')
// app = express()
app.use(serveStatic(__dirname + '/dist'))
var port = process.env.PORT || 7070
var hostname = '127.0.0.1'


// then in your app
var bodyParser = require('body-parser')
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended:false})

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    else {        
        var salt = bcrypt.genSaltSync(10);
        
        db.run(`CREATE TABLE Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username text, 
            Email text, 
            Password text,             
            Salt text,    
            Token text,
            DateLoggedIn DATE,
            DateCreated DATE
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
                db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
                db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
                db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS kegiatan (Id INTEGER PRIMARY KEY AUTOINCREMENT,jenis_acara TEXT, subjek_acara TEXT, lokasi TEXT, keterangan TEXT, tanggal_dimulai TEXT, tanggal_selesai TEXT)`,
        (err) => {
            if (err) {
                console.log('table kegiatan sudah ada')
            } 
        });


    }
});


module.exports = db
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization']
  }));
  
  app.use(express.urlencoded({ extended: true })
);

// app.use(cors({
//     origin: 'http://localhost:8080'
//   }));
//   app.use(express.urlencoded({ extended: true }));
//   app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization');
//     next();
//   });

app.get('/', (req, res) => res.send('API Root'));

//*  G E T   A L L
app.get("/auth/users", (req, res, next) => {
    var sql = "SELECT * FROM Users"
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


//* G E T   S I N G L E   U S E R

app.get("/auth/user/:id", (req, res, next) => {
    var sql = "SELECT * FROM Users WHERE Id = ?"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
})


// * R E G I S T E R   N E W   U S E R

app.post("/auth/register", async (req, res) => {
    var errors=[]
    try {
        const { Username, Email, Password } = req.body;

        if (!Username){
            errors.push("Username is missing");
        }
        if (!Email){
            errors.push("Email is missing");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        let userExists = false;
        
        
        var sql = "SELECT * FROM Users WHERE Email = ?"        
        await db.all(sql, Email, (err, result) => {
            if (err) {
                res.status(402).json({"error":err.message});
                return;
            }
            
            if(result.length === 0) {                
                
                var salt = bcrypt.genSaltSync(10);

                var data = {
                    Username: Username,
                    Email: Email,
                    Password: bcrypt.hashSync(Password, salt),
                    Salt: salt,
                    DateCreated: Date('now')
                }
        
                var sql ='INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                var params =[data.Username, data.Email, data.Password, data.Salt, Date('now')]
                var user = db.run(sql, params, function (err, innerResult) {
                    if (err){
                        res.status(400).json({"error": err.message})
                        return;
                    }
                  
                });           
            }            
            else {
                userExists = true;
                // res.status(404).send("User Already Exist. Please Login");  
            }
        });
  
        setTimeout(() => {
            if(!userExists) {
                res.status(201).json("Success");   
                // res.status(200).json({ message: 'Login successful' }); 
            } else {
                res.status(201).json("Record already exists. Please login");    
            }            
        }, 500);


    } catch (err) {
      console.log(err);
    }
})


// * L O G I N

app.post("/auth/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        
        if (!(Email && Password)) {
          return res.status(400).send("All input is required");
        }
        
        var sql = "SELECT * FROM Users WHERE Email = ?";
        db.all(sql, [Email], function(err, rows) {
          if (err) {
            return res.status(400).json({ "error": err.message });
          }
          
          if (rows.length === 0) {
            return res.status(400).send("No user found with the given email");
          }
          
          var user = rows[0];
          
          if (!user.Salt) {
            return res.status(400).send("Salt is missing for the user");
          }
          
          var PHash = bcrypt.hashSync(Password, user.Salt);
          
          if (PHash === user.Password) {
            // * CREATE JWT TOKEN
            const token = jwt.sign(
              { user_id: user.Id, username: user.Username, Email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
              }
            );
            
            user.Token = token;
          } else {
            return res.status(400).send("No Match");
          }
          
          return res.status(200).send(user);
        });
      } catch (err) {
        console.log(err);
      }      
});

  
// * T E S T  

app.post("/auth/test", auth, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});


// K E G I A T A N
// Tambah Kegiatan
app.post('/kegiatan/add', urlencodedParser, function (req, res) {
    db.serialize(()=>{
        db.run('INSERT INTO kegiatan (jenis_acara,subjek_acara,lokasi,keterangan,tanggal_dimulai,tanggal_selesai) VALUES(?,?,?,?,?,?)', [req.body.jenis_acara, req.body.subjek_acara, req.body.lokasi, req.body.keterangan, req.body.tanggal_dimulai, req.body.tanggal_selesai], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("New kegiatan has been added");
            res.send("New kegiatan has been added");
        });
    });
});

// Detail Kegiatan
app.get("/kegiatan/detail/:id", (req, res, next) => {
    var sql = "SELECT * FROM kegiatan WHERE Id = ?"
    db.all(sql, req.params.id, (err, rows) => {
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

// Delete
app.delete('/kegiatan/delete/:id', function(req,res){
    db.serialize(()=>{
        db.run('DELETE FROM kegiatan WHERE id = ?', req.params.id, function(err) {
            if (err) {
                res.send("Error encountered while deleting");
                return console.error(err.message);
            }
            res.send("Entry deleted");
            console.log("Entry deleted");
        });
    });
});

//   Tampil Semua data
app.get("/kegiatan/all", (req, res, next) => {
    var sql = "SELECT * FROM kegiatan"
    var body = []
    db.all(sql, body, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});

// Edit Kegiatan
app.get("/kegiatan/edit/:id", (req, res, next) => {
    var sql = "SELECT * FROM kegiatan WHERE Id = ?"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        });
    });
});

// Upadate Kegiatan
app.put('/kegiatan/update', urlencodedParser, function (req, res) {
    db.serialize(()=>{
        db.run('UPDATE kegiatan set jenis_acara=?, subjek_acara=?, lokasi=?, keterangan=?, tanggal_dimulai=?, tanggal_selesai=? WHERE id = ?', [req.body.jenis_acara, req.body.subjek_acara, req.body.lokasi, req.body.keterangan, req.body.tanggal_dimulai, req.body.tanggal_selesai, req.body.id], 
        function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("kegiatan has been updated");
            res.send("kegiatan has been updated");
        });
    });
});



app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));