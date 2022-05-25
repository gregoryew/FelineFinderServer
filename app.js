const express = require("express");
const bodyParser = require("body-parser");
const querystring = require('querystring');
var fs = require('fs');
const router = express.Router();
const app = express();
app.use("/", router);


const mysql = require('mysql');
const { fstat } = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit : 75,
  host: 'SG-FelineFinderDB-6244-mysql-master.servers.mongodirector.com',
  port: 3306,
  user: 'FelineFinder',
  password: 'GEW2023gew@25',
  database: 'defaultdb',
  ssl: {
      ca: fs.readFileSync('ca_cert.crt'),
      rejectUnauthorized: true
  }
});

function addUser(data) {
    let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
    let query = mysql.format(insertQuery,["Users","userid","username","password",data.userid,data.username,data.password]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log("addUser");
        console.log(response.insertId);
    });
}

function favorite(data) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["Favorites","userid","petid",data.userid,data.petid]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log("favoritePet");
        console.log(response.insertId);
    });
}

function unfavorite(data) {
    let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
    let query = mysql.format(deleteQuery,["Favorites",data.userid,data.petid]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log("unfavoritePet");
    });
}

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running at port 3000');
});

app.post("/addUser",(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("GOT HERE");
        console.log(req.body);
        addUser(req.body);
        res.sendStatus(200);
    });
});

app.post("/isFavorite", (req, res) => {
    pool.getConnection(async (err, connection) => {
        if(err) throw err;
        console.log("GOT HERE isFavorite");
        
        var params = new URLSearchParams(req.params);

        console.log("PARAMS=" + params);

        let selectQuery = 'SELECT COUNT(*) c FROM Favorites WHERE userID = ? AND petID = ?';
        let query = mysql.format(selectQuery,[req.body.userid, req.body.petid]);
        pool.query(query,(err, response, fields) => {
            if(err) {
                console.error(err);
                return;
            }
            // rows added
            console.log("isFavorite");
            console.log(response.length);
            if (response.length > 0) {
                console.log(JSON.stringify(response));
                return res.send({IsFavorite: response[0].c >= 1});
            } else {
                return res.send({IsFavorite: false});
            }
        });
    })});

app.post("/favorite", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("GOT HERE");
        console.log(req.body);

        favorite(req.body);

        res.sendStatus(200);
    });
});

app.post("/unfavorite", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("GOT HERE");
        console.log(req.body);

        unfavorite(req.body);

        res.sendStatus(200);
    });
});