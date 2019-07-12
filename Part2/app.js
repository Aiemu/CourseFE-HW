/**
 * "@Author ZengZheng 2017011438",
 * "@E-Mail zengz17@mails.tsinghua.edu.cn",
 * "@DateTime 2019/7/11"
 */

// initialize
const express = require('express')
const app = express()

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

app.listen(8000)

// hwtoken
const hwtoken = 'KMQZTTYWPQEULGYDMIJMOEGOOW'

// funtion for token checking
function Check (tok) {
  if (tok === hwtoken && tok) {
    console.log('Check Succeeded')
    return true
  } else {
    console.log('Check Failed')
    return false
  }
}

// API: POST ./api/compute
app.post('/api/compute', multipartMiddleware, function (req, res) {
  // check token
  if (Check(req.headers['hw-token']) === false) {
    res.status(403)
    res.send()
  } else {
    // compute
    let ret = null
    const p1 = Number(req.body.firstParam)
    const p2 = Number(req.body.secondParam)

    switch (req.body.type) {
      case 'ADD':
        ret = p1 + p2
        break
      case 'SUB':
        ret = p1 - p2
        break
      case 'MUL':
        ret = p1 * p2
        break
      case 'DIV':
        ret = Math.floor(p1 / p2)
        break
    }

    // return result
    res.format({
      'application/json': function () {
        res.send({
          ans: ret
        })
      }
    })
  }
})

// data-saved
const data = {}

// API: POST ./api/pair
app.post('/api/pair', multipartMiddleware, function (req, res) {
  // check token
  if (Check(req.headers['hw-token']) === false) {
    res.status(403)
    res.send()
  } else {
    // save data
    data[req.body.name] = req.body.key
    console.log('Node adding succeed. Num of node: ' + data.length)
    res.send()
  }
})

// API: GET ./api/pair
app.get('/api/pair', multipartMiddleware, function (req, res) {
  // check token
  if (Check(req.headers['hw-token']) === false) {
    res.status(403)
    res.send()
  } else {
    // return data
    if (!data[req.query.name]) {
      res.status(404)
      res.send()
    } else {
      res.format({
        'application/json': function () {
          // console.log('data: ' + data[req.body.name] + ' name: ' + req.body.name + ' key: ');
          console.log('Node getting succeed. Num of node: ' + data.length)
          res.send({
            key: data[req.query.name]
          })
          // console.log('data: ' + data[req.body.name] + ' name: ' + req.body.name + ' key: ' + req.body.key);
        }
      })
    }
  }
})

// API: DELETE ./api/pair
app.delete('/api/pair', multipartMiddleware, function (req, res) {
  // check token
  if (Check(req.headers['hw-token']) === false) {
    res.status(403)
    res.send()
  } else {
    // delete data
    if (data[req.query.name]) {
      delete data[req.query.name]
      console.log('Node deleting succeed. Num of node: ' + data.length)
      res.send()
    } else {
      res.status(404)
      res.send()
    }
  }
})
