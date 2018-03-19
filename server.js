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
        console.log("Error /api/people/:id" + '/n' + err);
    }
});

app.post("/api/people", async (req, res) => {

});

app.delete("/api/people/:id", async (req, res) => {

});

app.put("/api/people/:id", async(req, res) => {

});

app.get('*', (req, res) => {
    res.status(404).json({error: "404 Page Not Found"});
});

app.listen(3000, () => {
    console.log("Routes available on http://localhost:3000");
});