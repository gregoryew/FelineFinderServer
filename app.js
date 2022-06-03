const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
app.use("/", router);

const mysql = require('mysql');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

function getConn() {
    return conn = mysql.createConnection({
        host: process.env.DBHOST || 'feline-finder-do-user-11649465-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'felinefinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_lc_DS148AEozf_t'
    });
}

app.post("/isFavorite", (req, res) => {
    try {
        const conn = getConn();

        let selectQuery = 'SELECT COUNT(*) c FROM Favorites WHERE userID = ? AND petID = ?';
        let query = mysql.format(selectQuery,[req.body.userid, req.body.petid]);
        conn.query(query,(err, response, fields) => {
            if(err) {
                throw new Error(err);
            }
            else
            {
                if (response.length > 0) {
                    res.status(200).json({IsFavorite: response[0].c >= 1}).end();
                } else {
                    res.status(200).json({IsFavorite: false}).end();
                }
            }
        });
    } catch (err) {
        next(err);
    }
});

app.post("/addUser", (req, res) => {
    try {
        const conn = getConn();
    
        let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
        let query = mysql.format(insertQuery,["Users","userid","username","password",req.body.userid, req.body.username, req.body.password]);
        conn.query(query,(err, response) => {
            if(err) {
                throw new Error(err);
            }
            else
            {
                res.sendStatus(200);
            }
        });
    } catch (err) {
        next(err);
    }
});

app.post("/favorite", (req, res) => {
    try {
        const conn = getConn();

        let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
        let query = mysql.format(insertQuery,["Favorites", "userid", "petid", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            if(err) {
                res.sendStatus(500);
                throw new Error(err);
            }
            else
            {
                res.sendStatus(200);
            }
        });
    } catch (err) {
        next(err);
    }
});

app.post("/unfavorite", (req, res) => {
    try {
        const conn = getConn();

        let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
        let query = mysql.format(deleteQuery,["Favorites", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            if(err) {
                throw new Error(err);
            }
            else
            {
                res.sendStatus(200);
            }
        });
    } catch (err) {
        next(err);
    }
});

app.get("/", (req, res) => {
    res.sendStatus(200).send("HELLO");
});

let PORT = process.env.PORT || 3000;
let IP = process.env.IP || '127.0.0.1';
app.listen(PORT, IP, () => {
    console.log('Server is running at port ' + PORT + ' and IP = ' + IP);
});

app.use(function(err, req, res) {
    res.sendStatus(err.status || 500);
    // if you using view enggine
    res.render('error', {
        message: err.message,
        error: {}
    });
    // or you can use res.send();        
});