const express = require('express')
require('./db/mongoose')
const multer = require('multer')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT
const upload = multer({dest : 'images'})



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//endpoint to upload images
// app.post('/upload', upload.single('upload') , (req,res)=> {
//     res.send('SOME DATA')
// })


app.get('/' ,(req,res) => {
    res.send("this is home page")
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/favicon.ico' ,(req,res)=> {
    res.send("file is not present")
})



const Task = require('./models/task')
const User = require('./models/user')
