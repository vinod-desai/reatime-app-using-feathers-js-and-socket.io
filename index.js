const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const express = require('@feathersjs/express');
const moment = require('moment');

class UserService{
    constructor(){
        this.users = [];
    }
    async find(){
        return this.users;
    }
    async create(data){
        const user = {
            id: this.users.length,
            userName: data.userName,
            company: data.company,
            position: data.position
        }
        user.time = moment().format('h:mm:ss a');

        this.users.push(user);
        return user;
    }
}

const app = express(feathers());
app.use(express.json()); //Midlleware
app.configure(socketio()); // COnfigure socket.io for realtime APIs
app.use('/users', new UserService); // Register Service

// New connections connect to users channel
app.on('connection', conn => app.channel('users').join(conn));

app.publish(data => app.channel('users')); // Publish events to stream

// app.use(function(req, res, next) {
//     res.setHeader("Content-Security-Policy", "default-src 'self' http://localhost:3400/");
//     return next();
// });

const PORT = process.env.PORT || 3400;

app.listen(PORT).on('listening', () => console.log(`Express web server is running on port ${PORT}`));

// app.service('users').create({
//             userName: 'Josline',
//             company: 'Oracle',
//             position: 'Analyst',
//             time: moment().format('h:mm:ss a')
// });