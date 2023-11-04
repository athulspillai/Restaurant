const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const db = require('./db')
const connectToDatabase = require('./db')
const User = require('./models/usermodel')

const server = express()
const port = process.env.PORT || 8000;

server.use(cors('*'))
server.use(bodyParser.json())


connectToDatabase()

server.post('/register', async (req,res) => {
    const { username, email, phonenumber, password} = req.body;

    if(!username || !email || !phonenumber || !password) {
        return res.status(400).json({ message:'Please provide all required information'})
    }

    try {
        const existingUser = await User.findOne({ email})
        if (existingUser) {
            return res.status(409).json({ message: 'email already exists'})
        }

        const user = new User({ username, email, phonenumber, password})
        await user.save()
        res.status(201).json({ message: 'User registered successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.'})
    }
})

server.post('/', async (req,res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Email is Incorrect'})
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Password is incorrect'})
        }

        const token = jwt.sign({ email: user._id }, 'your-secret-key')

        res.json({ token})
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.'})
    }
})
;

server.listen(port, () => {
    console.log('Server is running on 8000');
})