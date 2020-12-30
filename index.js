var { response } = require('express');
var express = require('express');
var cors = require('cors')
var axios = require('axios');

// Create Express Server
var app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";

// CORS
// app.use(cors())

// Info GET endpoint
app.get('/github', (req, res, next) => {
  res.send('This is the github API for Figma Github.');
});

app.post('/github/login', verifyToken, async (req, res) => {
  console.log('Attempting to login to Github')
  let {status, response} = await isTokenValid(req.token, 'github')
  if(status) {
    // create JWT and send it in response
    console.log('Github login successful!')
    res.json({
      response
    })
  } else {
    console.log('Github login failed')
    res.sendStatus(403)
  }
})

app.post('/figma/login', verifyToken, async (req, res) => {
  let {status, response} = await isTokenValid(req.token, 'figma')
  console.log('Figma response', response)
  if(status) {
    // create JWT and send it in response
  } else {
    console.log('Figma login failed')
    res.sendStatus(403)
  }
})

function verifyToken(req, res, next) {
  console.log('verifying token')
  let bearerHeader = req.headers['authorization']
  if(bearerHeader !== undefined) {
    let bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}


async function isTokenValid(token, api) {
  if (api === 'figma') {
    return axios.get('https://api.figma.com/v1/me', {
      headers: {
        "X-Figma-Token": token,
      }
    })
    .then(response => {
      if (response.statusText == "OK") {
         return {status: true, response}
      }
    })
    .catch(error => {
      console.log("Caught error")
      return {status: false, response: error}
    })
  } else {
    return axios.get('https://api.github.com/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      if (response.statusText == "OK") {
         return {status: true, response}
      }
    })
    .catch(error => {
      console.log("Caught error")
      return {status: false, response: error}
    })
  }
  
  

}

// Start the Proxy
app.listen(PORT, (req, res) => {
  console.log(`Starting server at ${HOST}:${PORT}`);
});