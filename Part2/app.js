//initialize
let express = require('express');
let multipart = require('connect-multiparty');
let app = express();
let multipartMiddleware = multipart();
app.listen(8000);

//hwtoken
let hwtoken = 'KMQZTTYWPQEULGYDMIJMOEGOOW';

//data-saved
let data = {};

//funtion for token checking
function Check (req) {
    if (req.headers['hw-token'] === hwtoken && req.headers['hw-token']) {
        return true;
    }
    else {
        return false;
    }
}

//API: POST ./api/compute
app.post('/api/compute', multipartMiddleware, function(req, res) {
    //check token
    if (Check(req) === false) {
        res.send();
        return;
    }
    else {
        //compute
        let ret = null;
        let p1 = Number(req.body.firstParam);
        let p2 = Number(req.body.secondParam);

        switch(req.body.type) {
            case 'ADD':
                ret = p1 + p2;
                break;
            case 'SUB':
                ret = p1 - p2;
                break;
            case 'MUL': 
                ret = p1 * p2;
                break;
            case 'DIV': 
                ret = Math.floor(p1 / p2);
                break;
        }

        //return result
        res.format({
            'application/json': function() {
                res.send({
                    ans: ret
                });
            }
        });
        return;
    }
});

//API: POST ./api/pair
app.post('/api/pair', multipartMiddleware, function(req, res) {
    //check token
    if (Check(req) === false) {
        res.send();
        return;
    }
    else {
        //save data
        data[req.body.name] = req.body.key;
        res.send();
        return;
    }
});

//API: GET ./api/pair
app.get('/api/pair', multipartMiddleware, function(req, res) {
    //check token
    if (Check(req) === false) {
        res.send();
        return;
    }
    else {
        //return data
        if (!data[req.query.name]) {
            res.status(404);
            res.send();
        }
        else {
            res.format({
                'application/json': function () {
        console.log('data: ' + data[req.body.name] + ' name: ' + req.body.name + ' key: ');
                    res.send({
                        key: data[req.query.name]
                    });
        console.log('data: ' + data[req.body.name] + ' name: ' + req.body.name + ' key: ' + req.body.key);
                }
            });
        }
        return;
    }
});

//API: DELETE ./api/pair
app.delete('/api/pair', multipartMiddleware, function(req, res) {
    //check token
    if (Check(req) === false) {
        res.send();
        return;
    }
    else {
        //delete data
        if (data[req.query.name]) {
            delete data[req.query.name];
            res.send();
        }
        else {
            res.status(404);
            res.send();
        }
        return;
    }
});