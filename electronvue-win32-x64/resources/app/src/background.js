// import {app, BrowserWindow} from 'electron'

// function createBrowser(){
//     const win = new BrowserWindow({
//         width:800,
//         height:800,
//         webPreferences: {
//             nodeIntegration : true,
//             contextIsolation :  false,
//         }
//     });

//     const child = new BrowserWindow({
//         parent : win
//     })

//     win.loadURL('http://localhost:8080/');
// }

// app.on('ready', ()=> {
//     createBrowser()
// });

// app.on('window-all-closed', ()=>{
//     app.quit()
// });
// import { app, BrowserWindow, dialog } = require('electron')



// Panggil fungsi runNpmStart saat aplikasi Electron siap


const { app, BrowserWindow, dialog } = require('electron');

const { exec } = require('child_process');

// Fungsi untuk menjalankan npm start
function runNpmStart() {
  const child = exec('npm start && yarn serve-fe');
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

app.whenReady().then(runNpmStart);

// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
exapp = express();
exapp.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 7070;
var hostname = '127.0.0.1';



// const express = require('express');
// const app = express();
require("dotenv").config();
// const port = 3001;
var md5 = require('md5')
var sqlite3 = require('sqlite3').verbose()
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const DBSOURCE = "usersdb.sqlite";

require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};


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

exapp.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:8080'
    })
);

exapp.get('/', (req, res) => res.send('API Root'));


//*  G E T   A L L

exapp.get("/auth/users", (req, res, next) => {
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

exapp.get("/auth/user/:id", (req, res, next) => {
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

exapp.post("/auth/register", async (req, res) => {
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
            } else {
                res.status(201).json("Record already exists. Please login");    
            }            
        }, 500);


    } catch (err) {
      console.log(err);
    }
})


// * L O G I N

exapp.post("/auth/login", async (req, res) => {
  
  try {      
    const { Email, Password } = req.body;
        // Make sure there is an Email and Password in the request
        if (!(Email && Password)) {
            res.status(400).send("All input is required");
        }
            
        let user = [];
        
        var sql = "SELECT * FROM Users WHERE Email = ?";
        db.all(sql, Email, function(err, rows) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }

            rows.forEach(function (row) {
                user.push(row);                
            })
            
            var PHash = bcrypt.hashSync(Password, user[0].Salt);
       
            if(PHash === user[0].Password) {
                // * CREATE JWT TOKEN
                const token = jwt.sign(
                    { user_id: user[0].Id, username: user[0].Username, Email },
                      process.env.TOKEN_KEY,
                    {
                      expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                    }  
                );

                user[0].Token = token;

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

exapp.post("/auth/test", verifyToken, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});


// K E G I A T A N
// Tambah Kegiatan
exapp.post('/kegiatan/add', urlencodedParser, function (req, res) {
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
exapp.get("/kegiatan/detail/:id", (req, res, next) => {
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
exapp.delete('/kegiatan/delete/:id', function(req,res){
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
exapp.get("/kegiatan/all", (req, res, next) => {
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
exapp.get("/kegiatan/edit/:id", (req, res, next) => {
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
exapp.put('/kegiatan/update', urlencodedParser, function (req, res) {
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


exapp.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// exapp.listen(port, () => console.log(`API listening on port ${port}!`));


function createBrowser () {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      contextIsolation: true
    }
  })

  win.loadURL('http://localhost:8080')

  win.on('close', (event) => {
    const response = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Ya', 'Tidak'],
      title: 'Konfirmasi',
      message: 'Apakah Anda Ingin Menutup Aplikasi?',
      defaultId: 1,
      cancelId: 1
    })

    if (response === 1) {
      event.preventDefault()
    }
  })
}

app.on('ready', () => {
  createBrowser()
})

app.on('window-all-closed', () => {
  app.quit()
})
