# inter-process-communication
Demonstrate a worker-server API that performs CRUD operations using Redis Publish-Subscribe model.

### Running the API
Install all npm dependencies on your terminal by running
> npm install

Both server and worker start with the single command
> npm start

**If you use `nodemon` instead, both the server and worker may not run concurrently.**

---

### Calling the API

Use [Postman](https://www.getpostman.com/) to call the APIs

## GET

> http://localhost:3000/api/people/:id

This API will publish a message to request a person from the worker, and render JSON of the person (or of an error, should one occur).

**SUCCESS**

Code: 200

Message :  {
        "id": 1,
        "first_name": "Raymond",
        "last_name": "Washington",
        "email": "rwashington0@vkontakte.ru",
        "gender": "Male",
        "ip_address": "214.64.240.51"
    }


**FAILURE**

Code: 404

Message: {error: "User Not Found"}



## DELETE

> http://localhost:3000/api/people/:id

This API will publish a message to request that the worker deletes a person, and render JSON stating that the operation completed (or an error should one occur).

**SUCCESS**

Code: 200

Message: {success : "User deleted!"}

**FAILURE**

Code: 404
Message: {error: "Deletion unsuccessful! Try again."}



## POST

> http://localhost:3000/api/people

This API will publish a message to request that the worker creates a person, and render JSON of the person created (or an error, should one occur).

*Pass all parameters id, first_name, last_name, email, gender, ip_address for successful update*
*Set Header: Content-Type application/json*
*Pass json data in the body by slecting raw format*

**SUCCESS**

Code: 200

Message: {
    "id": 1001,
    "first_name": "Jon",
    "last_name": "Snow",
    "email": "jsnow@got.com",
    "gender": "Male",
    "ip_address": "1.1.1.1"
}

**FAILURE**

Code: 400

Message: {"error": "Missing value" },  {"error": "Unable to add user."}



## PUT

> http://localhost:3000/api/people/:id

This API will publish a message to request that the worker updates a person, and render JSON of the person updated (or of an error, should once occur)

Header: Content-Type application/json
Body: {
	"first_name" : "John",
	"last_name" : "Targaryen",
	"ip_address" : "10.10.10.10"
}

*Id is not mutable*

**SUCCESS**

Code: 200

Message: {
    "id": 1001,
    "first_name": "John",
    "last_name": "Targaryen",
    "email": "jsnow@got.com",
    "gender": "Male",
    "ip_address": "10.10.10.10"
}

**FAILURE**

Code:400

Message: {error : "Could not update record."}

