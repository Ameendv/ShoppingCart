var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID;


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(data.insertedId) }).then((user) => {
                    resolve(user)
                })
            })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status => {
                    if (status) {
                        console.log("Login Succesfull")
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Incorrect Password")
                        response.user=user
                        resolve( response)
                    }
                }))
            } else {
                console.log("Login Failed")
                response.mail=true

                resolve(response)

            }
        })
    }
}