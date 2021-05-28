var express = require('express');
var app = express();
var cors = require('cors');
var database = require('./dbconfig/database');
var port = process.env.PORT || 30005;

database.connect((err) => {
    if(err) throw err;
});

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use('/', [
    require('./routes/autocomplete'),
    require('./routes/matches')
]);


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});


