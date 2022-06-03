const express = require("express");
const bodyParser = require("body-parser");
const querystring = require('querystring');
const router = express.Router();
const app = express();
app.use("/", router);

const mysql = require('mysql');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.post("/isFavorite", (req, res) => {
    try {
        console.debug("isFavorite Start");

        const conn = mysql.createConnection({
            host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
            port: process.env.DBPORT || '25060',
            user: process.env.DBUSER || 'felinefinder',
            database: process.env.DBNAME || 'defaultdb',
            password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
        });

        console.log("isFavorite logged on to db");

        let selectQuery = 'SELECT COUNT(*) c FROM Favorites WHERE userID = ? AND petID = ?';
        let query = mysql.format(selectQuery,[req.body.userid, req.body.petid]);
        conn.query(query,(err, response, fields) => {
            if(err) {
                console.log(err);
                res.status(500).send("Error querying database.");
                return;
            }
            // rows added
            console.log("isFavorite");
            console.log(response.length);
            if (response.length > 0) {
                console.log(JSON.stringify(response));
                res.status(200).json({IsFavorite: response[0].c >= 1});
            } else {
                res.status(200).json({IsFavorite: false});
            }
    });
    } catch (err) {
        next(err);
    }
});

let PORT = process.env.PORT || 3000;
let IP = process.env.IP || '127.0.0.1';
app.listen(PORT, IP, () => {
    console.log('Server is running at port ' + PORT + ' and IP = ' + IP);
});

/*
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
*/

function addUser(data) {
    const conn = mysql.createConnection({
        host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'felinefinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
    });
    
    let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
    let query = mysql.format(insertQuery,["Users","userid","username","password",data.userid,data.username,data.password]);
    conn.query(query,(err, response) => {
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
    const conn = mysql.createConnection({
        host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'felinefinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
    });

    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["Favorites","userid","petid",data.userid,data.petid]);
    conn.query(query,(err, response) => {
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
    const conn = mysql.createConnection({
        host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'felinefinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
    });

    let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
    let query = mysql.format(deleteQuery,["Favorites",data.userid,data.petid]);
    conn.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log("unfavoritePet");
    });
}

app.post("/addUser",(req,res) => {
    const conn = mysql.createConnection({
        host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'felinefinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
    });

    //pool.getConnection((err, connection) => {
        //if(err) throw err;
        console.log("GOT HERE");
        console.log(req.body);
        addUser(req.body);
        res.sendStatus(200);
    //});
});

app.post("/favorite", (req, res) => {
        console.log("GOT HERE");
        console.log(req.body);

        favorite(req.body);

        res.sendStatus(200);
    //});
});

app.post("/unfavorite", (req, res) => {
    //pool.getConnection((err, connection) => {
        //if(err) throw err;
        console.log("GOT HERE");
        console.log(req.body);

        unfavorite(req.body);

        res.sendStatus(200);
    //});
});

app.get("/", (req, res) => {
    res.status(200).send("HELLO");
});