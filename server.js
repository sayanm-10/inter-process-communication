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
                res.status(200).json(data.user).end();
            } else {
                res.status(404).json({error: "User Not Found"}).end();
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
        res.status(400).json({error: "Missing user data"}).end();
        return;
    } else if (!user.id) {
        res.status(400).json({error: "Missing id"}).end();
        return;
    } else if (!user.first_name) {
        res.status(400).json({error: "Missing first name"}).end();
        return;
    } else if (!user.last_name) {
        res.status(400).json({error: "Missing last name"}).end();
        return;
    } else if (!user.email) {
        res.status(400).json({error: "Missing email"}).end();
        return;
    } else if (!user.gender) {
        res.status(400).json({error: "Missing gender"}).end();
        return;
    } else if (!user.ip_address) {
        res.status(400).json({error: "Missing ip address"}).end();
        return;
    } else if(isNaN(parseInt(user.id))) {
        res.status(400).json({error: "Id is not an integer"}).end();
        return;
    }

    try {
        redisPubSub.emit("new-user", {user: req.body});
        redisPubSub.on("dupe-found", (data, channel) => {            
            res.status(403).json({error: "User already exists! Try updating using id."}).end();
        });
        redisPubSub.on("user-added", (data, channel) => {
            if (Object.keys(data.user).length > 0) {
                res.status(200).json(data.user).end();
            } else {
                res.status(400).json({error: "Unable to add user."}).end();
            }
        });
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error POST /api/people" + '/n' + err);
    }
});

app.delete("/api/people/:id", async (req, res) => {
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).json({error: "Id is not an integer"}).end();
        return;
    }

    try {
        redisPubSub.emit("del-user", {id: req.params.id});
        redisPubSub.on("del-confirmed", (data, channel) => {
            if (data.deleted) {
                res.status(200).json({success : "User deleted!"}).end();
            } else {
                res.status(404).json({error: "Deletion unsuccessful! Try again."}).end();
            }
        });
    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error DELETE /api/people/:id" + '/n' + err);
    }
});

app.put("/api/people/:id", async(req, res) => {
    const userData = req.body;

    if (Object.keys(userData).length === 0) { // object is not empty
        res.status(400).json({error: "Missing user data"}).end();
        return;
    }
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).json({error: "Id is not an integer"}).end();
        return;
    }

    try {
        redisPubSub.emit("update-user", {id: req.params.id, userData: userData});
        redisPubSub.on("update-failed", (data, channel) => {
            res.status(400).json({error : "User not found."}).end();
        });
        redisPubSub.on("update-confirmed", (data, channel) => {
            if (Object.keys(data.user).length > 0) {
                res.status(200).json(data.user).end();
            } else {
                res.status(400).json({error : "Could not update record."}).end();
            }
        });

    } catch (err) {
        // the server gave up!
        res.status(500).send();
        console.log("Error PUT /api/people/:id" + '/n' + err);
    }
});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"}).end();
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});