const redisPubSub = require("./redis_connection");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.get("/api/people/:id", async (req, res) => {
    try {
        redisPubSub.emit("get-user", {id: req.params.id});
        redisPubSub.on("user-found", (data, channel) => {
            if (data.user.length > 0) {
                res.status(200).json(data.user);
            } else {
                res.status(404).json({error: "Record Not Found"});
            }
        });
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error GET /api/people/:id" + '/n' + err);
    }
});

app.post("/api/people", async (req, res) => {
    const user = req.body;

    if (Object.keys(user).length === 0) { // object is not empty
        res.status(400).json({error: "Missing user data"});
    } else if (!user.id) {
        res.status(400).json({error: "Missing id"});
    } else if (!user.first_name) {
        res.status(400).json({error: "Missing first name"});
    } else if (!user.last_name) {
        res.status(400).json({error: "Missing last name"});
    } else if (!user.email) {
        res.status(400).json({error: "Missing email"});
    } else if (!user.gender) {
        res.status(400).json({error: "Missing gender"});
    } else if (!user.ip_address) {
        res.status(400).json({error: "Missing ip address"});
    } else if(isNaN(parseInt(user.id))) {
        res.status(400).json({error: "Enter integer ID"});
    }

    try {
        redisPubSub.emit("new-user", {user: req.body});
        redisPubSub.on("user-added", (data, channel) => {
            if (Object.keys(data.user).length > 0) {
                res.status(200).json(data.user);
            } else if (data.isDuplicate) {
                res.status(403).json({error: "User already exists! Try updating using id."});
            } else {
                res.status(400).json({error: "Unable to add user."});
            }
        });
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error POST /api/people" + '/n' + err);
    }
});

app.delete("/api/people/:id", async (req, res) => {
    try {
        redisPubSub.emit("del-user", {id: req.params.id});
        redisPubSub.on("del-confirmed", (data, channel) => {
            if (data.deleted) {
                res.status(200).json({success : "User deleted!"});
            } else {
                res.status(404).json({error: "Deletion unsuccessful! Try again."});
            }
        });
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error DELETE /api/people/:id" + '/n' + err);
    }
});

app.put("/api/people/:id", async(req, res) => {
    try {

    } catch (err) {
        
    }
});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"});
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});