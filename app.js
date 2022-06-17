const express = require("express");
const router = express.Router();
const app = express();
app.use("/", router);

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

//app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());

function getConn() {
    return conn = mysql.createConnection({
        host: process.env.DBHOST || "db-mysql-sfo3-22193-do-user-8209640-0.b.db.ondigitalocean.com",
        port: process.env.DBPORT || "25060",
        user: process.env.DBUSER || "FelineFinder",
        database: process.env.DBNAME || "defaultdb",
        password: process.env.DBPASSWORD || "AVNS_3Sfkz7FXwS6OCC0hSHC"
    });
}

app.post("/isFavorite", (req, res) => {
    try {
        let dir = path.join(__dirname, '/log.txt');
        fs.appendFileSync(dir, 'entered /isFavorite \n');
        const conn = getConn();
        fs.appendFileSync(dir, 'got conn \n');
        conn.connect();
        fs.appendFileSync(dir, 'connected to db \n');

        let selectQuery = 'SELECT COUNT(*) c FROM Favorites WHERE userID = ? AND petID = ?';
        let query = mysql.format(selectQuery,[req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            fs.appendFileSync(dir, 'ran query ' + query + '\n');

            if(err) {
                res.statusStatus(500);
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
        fs.appendFileSync(dir, 'entered /addUser \n');
        const conn = getConn();
        fs.appendFileSync(dir, 'got conn \n');
        conn.connect();
        fs.appendFileSync(dir, 'connected to db \n');

        let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
        let query = mysql.format(insertQuery,["Users","username","password", req.body.username, req.body.password]);
        conn.query(query,(err, response) => {
            fs.appendFileSync(dir, 'ran query ' + query + '\n');
            if(err) {
                //fs.appendFileSync(dir, 'got error' + err.message + '\n');
                res.sendStatus(500);
            }
            else
            {
                //fs.appendFileSync(__dirname, 'got success \n');
                res.sendStatus(200);
            }
        });
        fs.appendFileSync(__dirname + '/log.txt', 'conn.end \n');
        conn.end();
    } catch (err) {
        fs.appendFileSync(__dirname + '/log.txt', 'got error ' + err.message);
        next(err);
    }
});

app.post("/favorite", (req, res) => {
    try {
        let dir = path.join(__dirname, '/log.txt');
        fs.appendFileSync(dir, 'entered /favorite \n');
        const conn = getConn();
        fs.appendFileSync(dir, 'got conn \n');
        conn.connect();
        fs.appendFileSync(dir, 'connected to db \n');

        let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
        let query = mysql.format(deleteQuery,["Favorites", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            fs.appendFileSync(dir, 'ran query ' + query + '\n');
            if(err) {
                res.sendStatus(500);
            }
            else
            {
                let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?)';
                let query2 = mysql.format(insertQuery,["Favorites", "userid", "petid", req.body.userid, req.body.petid]);
                conn.query(query2,(err2, response) => {
                    fs.appendFileSync(dir, 'ran query ' + query2 + '\n');
                    if(err2) {
                        res.sendStatus(500);
                    }
                    else
                    {
                        res.sendStatus(200);
                    }
                });
            }
        });
        fs.appendFileSync(__dirname + '/log.txt', 'conn.end \n');
        conn.end();
    } catch (err) {
        fs.appendFileSync(__dirname + '/log.txt', 'got error ' + err.message);
        next(err);
    }
});

app.post("/unfavorite", (req, res) => {
    try {
        let dir = path.join(__dirname, '/log.txt');
        fs.appendFileSync(dir, 'entered /favorite \n');
        const conn = getConn();
        fs.appendFileSync(dir, 'got conn \n');
        conn.connect();
        fs.appendFileSync(dir, 'connected to db \n');
        
        let deleteQuery = 'DELETE FROM ?? WHERE userid = ? AND petid = ?';
        let query = mysql.format(deleteQuery,["Favorites", req.body.userid, req.body.petid]);
        conn.query(query,(err, response) => {
            fs.appendFileSync(dir, 'ran query ' + query + '\n');
            if(err) {
                res.sendStatus(500);
            }
            else
            {
                res.sendStatus(200);
            }
        });
        fs.appendFileSync(__dirname + '/log.txt', 'conn.end \n');
        conn.end();
    } catch (err) {
        fs.appendFileSync(__dirname + '/log.txt', 'got error ' + err.message);
        next(err);
    }
});

app.get("/", (req, res) => {
    let dir = path.join(__dirname, '/log.txt');
    res.send("HELLO8 dir=|" + dir + "|" );
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