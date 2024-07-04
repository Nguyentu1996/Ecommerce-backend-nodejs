'use strict';

const mysql = require('mysql2');

const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 8811,
  user: 'root',
  password: 'tudev',
  database: 'test',
})

const batchSize = 100000;
const totalRecord = 1_000_000;

let currentId = 1;
const insertBatch = async () => {
  const value = [];
  for (let i = 0; i < batchSize && currentId <= totalRecord; i++) {
    const name = `name-${currentId}`;
    const age = Math.random(10, 60);
    const address = `address-${currentId}`;
    value.push([currentId, name, age, address])
    currentId++;
  }

  if (!value.length) {
    connectionPool.end(err => {
      if (err) {
        console.log(`ERROR: error occurred while running batch`)
      } else {
        console.log(`connection pool close successfuly`)
      }
    })
    return;
    
  }

  const sql = `INSERT INTO table_test(id, name, age, address) VALUES ?`
  connectionPool.query(sql, [value], async function (err, results) {
    if(err) throw err
    
    console.log(`query result:`, results.effectRows);
    await insertBatch()
  })

}

insertBatch().catch(console.error)

