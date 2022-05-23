const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const mysql = require("mysql")

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "userdata",
    port: 3305,
})

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/api/get", (req, res) => {
    const sqlSelect = "SELECT * FROM user_info"
    db.query(sqlSelect, (err, result) => {

        //Changes all dates to local 
        for (let i = 0; i < result.length; i++) {
            result[i].date_of_birth = result[i].date_of_birth.toLocaleDateString();
        }

        res.send(result);
    });
})

app.delete("/api/delete/:last_name/:date_of_birth", (req, res) => {
    const last_name = req.params.last_name;
    const date_of_birth = (req.params.date_of_birth).split("-").reverse().join("/");
    console.log(date_of_birth);

    // console.log(lname);
    const sqlDelete = "DELETE FROM user_info WHERE last_name = ? AND date_of_birth = ?";
    db.query(sqlDelete, [last_name, date_of_birth], (err, result) => {
        if (err) console.log(err);
        else res.send(result.status)
    });
})


app.put("/api/update", (req, res) => {
    const last_name = req.body.last_name;
    const date_of_birth = (req.body.date_of_birth).split("/").reverse().join("");
    const tableToUpdate = req.body.tableName;
    const newEntry = req.body.newEntry;
    let sqlUpdate = "";

    if (tableToUpdate == "first_name") sqlUpdate = "UPDATE user_info SET first_name = ?  WHERE last_name = ? AND date_of_birth = ?"
    else if (tableToUpdate == "last_name") sqlUpdate = "UPDATE user_info SET last_name = ?  WHERE last_name = ? AND date_of_birth = ?"
    else if (tableToUpdate == "date_of_birth") sqlUpdate = "UPDATE user_info SET date_of_birth = ?  WHERE last_name = ? AND date_of_birth = ?"
    else if (tableToUpdate == "email") sqlUpdate = "UPDATE user_info SET email = ?  WHERE last_name = ? AND date_of_birth = ?"
    else if (tableToUpdate == "mobile") sqlUpdate = "UPDATE user_info SET mobile = ?  WHERE last_name = ? AND date_of_birth = ?"

    const update = sqlUpdate;
    console.log(last_name + " " + date_of_birth + " " + newEntry);
    console.log(sqlUpdate);
    db.query(update, [newEntry, last_name, date_of_birth], (err, result) => {
        if (!err) res.send(result.status)

    });
})


//Sending data
app.post("/api/insert", (req, res) => {

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const date_of_birth = req.body.date_of_birth;
    const email = req.body.email;
    const mobile = req.body.mobile;

    const sqlInsert = "INSERT INTO user_info (first_name,last_name,date_of_birth,email,mobile) VALUES (?,?,?,?,?)"
    db.query(sqlInsert, [first_name, last_name, date_of_birth, email, mobile], (err, result) => {
        console.log("Inserter" + " " + result);
        // console.log("Error" + " " + err);
    });
});




app.listen(3001, () => {
    console.log("Running on port 3001");

});