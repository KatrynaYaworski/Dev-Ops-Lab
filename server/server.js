const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(`public`))

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'df209bef5abe40638c39488c66c31ebe',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')


const colors = [ 'blue', 'green', 'purple']

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

app.get('/api/colors', (req, res) => {
    rollbar.info('Someone got the list of colors on page load')
    res.status(200).send(colors)
})

app.post('/api/colors', function(req, res) {
    let { name } = req.body;
    
    const index = colors.findIndex((color) => {
        return color === name
    })

    try {
        if (index === -1 && name !== "") {
          colors.push(name);
          rollbar.info('Someone added a color')
          res.status(200).send(colors);
        } else if (name === "") {
            rollbar.error('Someone tried to enter a blank color')

            res.status(400).send("must provide a name");
        } else {
            rollbar.error('Someone tried to enter a duplicate color name')
          res.status(400).send("that color already exists");
        }
      } catch (err) {
        console.log(err)
        rollbar.error(err)
      }
})

app.delete('/api/colors/:index', (req, res) => {
    const targetIndex = +req.params.index

    colors.splice(targetIndex, 1);

    rollbar.info('Someone deleted a color')
    res.status(200).send(colors)
})

app.listen(4000, () => console.log(`server running on 4000`))