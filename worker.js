const redisPubSub = require('./redis_connection');
const axios = require('axios');

const DataUrl = "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
let UserData = null;

const init = async () => {
    // download dummy data
    const userJson = await axios.get(DataUrl);
    UserData = userJson.data;
};

redisPubSub.on("get-user", async (data, channel) => {
    if (!UserData) {
        redisPubSub.emit("user-found", {user : ""});
        return;
    }

     const user = UserData.filter(user => {
        return user.id === parseInt(data.id);
    });

    redisPubSub.emit("user-found", { user: user });
});

redisPubSub.on("del-user", async (data, channel) => {
    if (!UserData) {
        redisPubSub.emit("del-confirmed", {deleted: false});
        return;
    }

    UserData = UserData.filter(user => {
        return user.id !== parseInt(data.id);
    });

    redisPubSub.emit("del-confirmed", {deleted: true});
});

redisPubSub.on("new-user", async(data, channel) => {
    if (!UserData) {
        redisPubSub.emit("user-added", {user : ""});
        return;
    }

    let newUser = {
        id: data.user.id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        gender: data.user.gender,
        ip_address: data.user.ip_address
    }

    UserData.push(newUser);

    redisPubSub.emit("user-added", {user: newUser});
});

redisPubSub.on("update-user", async(data, channel) => {

});

init();
