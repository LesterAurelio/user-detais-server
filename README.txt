Basic Auth
Username: admin
Password: admin

POST http://localhost:3000/addUserDetails
Body { 
	"email": "lester@gmail.com", 
	"firstName": "Lester", 
	"lastName": "Dsouza" 
}
Response {
  "status": true,
  "userId": "aby6cmgw"
}

GET http://localhost:3000/getUserById/aby6cmgw
Response {
  "status": true,
  "details": {
      "_id": "5c3caa4f1c2f060c98fe851e",
      "userId": "aby6cmgw",
      "email": "lester@gmail.com",
      "fname": "Lester",
      "lname": "Dsouza"
  }
}
GET http://localhost:3000/getUsers
Response {
  "status": true,
  "users": [
      {
          "_id": "5c3caa4f1c2f060c98fe851e",
          "userId": "aby6cmgw",
          "email": "lester@gmail.com",
          "fname": "Lester",
          "lname": "Dsouza"
      }
  ]
}