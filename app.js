const express = require("express");
const router = express.Router();
const app = express();
app.use("/", router);

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

app.use(express.json());

function getConn() {
    return conn = mysql.createConnection({
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        user: process.env.DBUSER,
        database: process.env.DBNAME,
        password: process.env.DBPASSWORD
        //ssl  : {
        //    ca : fs.readFileSync(__dirname + '/ca-certificate.crt')
        //}
    });
}

app.post("/isFavorite", (req, res) => {
    try {
        const conn = getConn();
        conn.connect();

        let selectQuery = 'SELECT COUNT(*) c FROM Favorites WHERE userID = ? AND petID = ?';
        let query = mysql.format(selectQuery,[req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            if(err) {
                res.status(500);
            }
            else
            {
                if (response.length > 0) {
                    res.json({IsFavorite: response[0].c >= 1});
                } else {
                    res.json({IsFavorite: false});
                }
            }
        });
        conn.end();
    } catch (err) {
        next(err);
    }
});

app.post("/addUser", (req, res) => {
    try {
        let dir = path.join(__dirname, '/log.txt');
        fs.appendFileSync(dir, 'entered /addUser');
        const conn = getConn();
        fs.appendFileSync(dir, 'got conn');
        conn.connect();
        fs.appendFileSync(dir, 'connected to db');

        let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
        let query = mysql.format(insertQuery,["Users","username","password", req.body.username, req.body.password]);
        conn.query(query,(err, response) => {
            fs.appendFileSync(dir, 'ran query ' + query);
            if(err) {
                fs.appendFileSync(dir, 'got error' + err.message);
                res.send(500);
            }
            else
            {
                fs.appendFileSync(dir, 'got success');
                res.send(200);
            }
        });
        fs.appendFileSync(dir, 'conn.end');
        conn.end();
    } catch (err) {
        fs.appendFileSync(dir, 'got error ' + err.message);
        next(err);
    }
});

app.post("/favorite", (req, res) => {
    try {
        const conn = getConn();
        conn.connect();

        let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
        let query = mysql.format(insertQuery,["Favorites", "userid", "petid", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            if(err) {
                res.send(500);
            }
            else
            {
                res.send(200);
            }
        });
        conn.end();
    } catch (err) {
        next(err);
    }
});

app.post("/unfavorite", (req, res) => {
    try {
        const conn = getConn();
        conn.connect();
        
        let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
        let query = mysql.format(deleteQuery,["Favorites", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            if(err) {
                res.send(500);
            }
            else
            {
                res.send(200);
            }
        });
        conn.end();
    } catch (err) {
        next(err);
    }
});

app.get("/", (req, res) => {
    let dir = path.join(__dirname, '/log.txt');
    fs.appendFileSync(dir, 'entered / HELLO7');
    res.send("HELLO7 " + dir);
});

let PORT = process.env.PORT || 3000;
let IP = process.env.IP || '127.0.0.1';
const server = app.listen(PORT, IP, () => {
    console.log('Server is running at port ' + PORT + ' and IP = ' + IP);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);        
});