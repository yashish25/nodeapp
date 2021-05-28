var express = require('express');
var app = express();
var database = require('../dbconfig/database');
var http = require('http');
http.globalAgent.maxSockets = 100;

app.get('/api/branches/autocomplete', async (req, res) => {

  await fetchData(req)
  .then(result => res.json(result))
  .catch(err => res.json(err))
  
});


// fetching data asynchronously from a postgresql db
async function fetchData(req){
  return new Promise(async function(resolve, reject){
    
    let o = {}; //empty Object
    let inputReqQ = req.query.q;
    let qLimit = req.query.limit;
    let qOffset = req.query.offset;
    if(inputReqQ == undefined){
      o["error"] = "Please use q as query parameter!"
      resolve(o)
    }
    
    if(qLimit == null || qLimit == ""){
      qLimit = 999999;
    }
    if(qOffset ==null || qOffset == "" ){
      qOffset = 0;
    }
    
    let sql = `SELECT * FROM branches WHERE branch ILIKE '${'%'+req.query.q + '%'}'
                ORDER BY ifsc LIMIT ${qLimit} OFFSET ${qOffset}`
    
    console.log(sql)
     
    let key = 'branches';
    database.query(sql, (err, result) => {
      if (err) {
        
        console.log(err);
        reject(err);
      }
      // console.log(result["rows"].length);
      if(result["rows"].length){
        o[key] = result["rows"];
        resolve(o);
      }
      else{
        o["message"] = "No results found!!"
        resolve(o);
      }
 
    });

  })
}








module.exports = app;