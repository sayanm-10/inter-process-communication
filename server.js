const redisPubSub = require("./redis_connection");
const express = require("express");
const app = express();

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
    try {

    } catch (err) {
        
    }
});

app.delete("/api/people/:id", async (req, res) => {
    try {
        redisPubSub.emit("del-user", {id: req.params.id});
        redisPubSub.on("del-confirmed", (data, channel) => {
            if (data.deleted) {
                res.status(200).json({success : "User deleted!"});
            } else {
                res.status(500).json({error: "Deletion unsuccessful! Try again."});
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