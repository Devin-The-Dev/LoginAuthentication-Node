const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

// Allow app to accept JSON
app.use(express.json());

// Normally this is stored in a database, but for testing purposes we're storing it in an array
const users = [];

// This is the route
app.get('/users', (req, res) => {
    res.json(users)
});

// Now create a way to create users. We're using "async" because bcrypt is an asynchronous function
app.post('/users', async (req, res) => {
    try {
        // "await" because this is an asynchronous function
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

// Now we need to compare passwords from the user and what they stored
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user === null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        };
    } catch {
        res.status(500).send();
    }
})

// This won't do anything unless we have a route set up
app.listen(3000);