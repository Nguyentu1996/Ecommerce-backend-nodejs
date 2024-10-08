'use strict'
const mongoose = require('mongoose');
const { db: { host, port, name } } = require('../configs/connection.config.js')
const connectionString = `mongodb://${host}:${port}/${name}`

class Database {
  constructor() {
    this.connect()
  }

  // connect
  connect(type ='mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connect(connectionString).then(_ => console.log(`Connected Mongodb Success`))
    .catch(err => console.log(`Error connect!`))
  }

  static getInstance() {

    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb
