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
        host: process.env.DBHOST || 'db-mysql-sfo3-22193-do-user-8209640-0.b.db.ondigitalocean.com',
        port: process.env.DBPORT || '25060',
        user: process.env.DBUSER || 'FelineFinder',
        database: process.env.DBNAME || 'defaultdb',
        password: process.env.DBPASSWORD || 'AVNS_2Enlzg3d2OszaHsM_5-',
        ssl  : {
            ca : fs.readFileSync(__dirname + '/ca-certificate.crt')
        }
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
        const conn = getConn();
        conn.connect();

        let insertQuery = 'INSERT INTO ?? (??,??,??) VALUES (?,?,?)';
        let query = mysql.format(insertQuery,["Users","id","username","password",req.body.userid, req.body.username, req.body.password]);
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
    res.send("HELLO5");
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