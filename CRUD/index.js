var sqlite3 = require('sqlite3').verbose();
var express = require('express');

var http = require('http');


var app = express();
var server = http.createServer(app);
// menyambungkan pada database
// var db = new sqlite3.Database('./database/db_employee.db');
var db = new sqlite3.Database('./database/sidang.db');

// membuat tabel dalam database
// db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');
db.run('CREATE TABLE IF NOT EXISTS acara (id TEXT,jenis_acara TEXT, subjek_acara TEXT, lokasi TEXT, keterangan TEXT)');

app.get('/', function(req,res){
  res.send("<h3>arul<h3>");
});

// create
app.get('/add/:id/:jenis_acara/:subjek_acara/:lokasi/:keterangan', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO acara (id,jenis_acara,subjek_acara,lokasi,keterangan) VALUES(?,?,?,?,?)', [req.params.id,req.params.jenis_acara, req.params.subjek_acara, req.params.lokasi, req.params.keterangan], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New sidang has been added");
      res.send("New sidang has been added into the database with jenis_acara = "+req.params.jenis_acara+ " and subjek_acara = "+req.params.subjek_acara);
    });
});
});

// read
app.get('/view/:id', function(req,res){
  db.serialize(()=>{
    db.each('SELECT id ID, subjek_acara NAME FROM acara WHERE id =?', [req.params.id], function(err,row){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Subjek: ${row.NAME}`);
      console.log("Entry displayed successfully");
    });
  });
});

// update
app.get('/update/:id/:keterangan', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE acara SET keterangan = ? WHERE id = ?', [req.params.keterangan,req.params.id], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
});

// delete
app.get('/del/:id', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM acara WHERE id = ?', req.params.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });
});

// close database
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});

server.listen(3000,function(){ 
    console.log("Server listening on port: 3000");
});