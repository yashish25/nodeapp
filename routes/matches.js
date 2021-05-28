var express = require('express');
var app = express();
var database = require('../dbconfig/database');
var http = require('http');
http.globalAgent.maxSockets = 100;

app.get('/api/branches', async (req, res) => {
    
    await fetchData(req)
    .then(result => res.json(result))
    .catch(err => res.json(err))
    
    
});


// fetching data asynchronously from a postgresql db
async function fetchData(req){
    // console.log(req)
    return new Promise(async function(resolve, reject){
        let obj = {};
        let qLimit = req.query.limit;
        let qOffset = req.query.offset;
        let inputReqQ = req.query.q;
        if(inputReqQ == undefined){
            obj["error"] = "Please use q as query parameter!"
            resolve(obj)
        }
        
        if(qLimit == null || qLimit == "" || parseInt(qLimit) < 0){
            qLimit = 999999;
        }
        if(qOffset ==null || qOffset == "" || parseInt(qOffset) < 0){
            qOffset = 0;
        }
        let sql = `SELECT * FROM branches WHERE (branch ILIKE '${'%'+req.query.q+'%'}' OR city ILIKE '${'%'+req.query.q+'%'}'
                    OR state ILIKE '${'%'+req.query.q+'%'}' OR address ILIKE '${'%'+req.query.q+'%'}' OR district ILIKE '${'%'+req.query.q+'%'}')
                ORDER BY ifsc LIMIT ${qLimit} OFFSET ${qOffset}`
    // console.log(sql);
        
        let key = 'branches';
        database.query(sql, (err, result) => {
            if(err) {
                obj[key] = err;
                reject(obj);
            }
            // console.log(result);
            if(result["rows"].length){
                obj[key] = result["rows"];
                resolve(obj);
            }
            else{
                obj["message"] = "No results found"
                resolve(obj);
            }
            
        })


    })
}

module.exports = app;  
