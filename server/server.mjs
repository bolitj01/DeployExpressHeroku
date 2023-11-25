import { log } from 'console';
import PocketBase from 'pocketbase';
import express from 'express';

const pb = new PocketBase('http://127.0.0.1:8090');

const app = express();

//middleware
app.use(express.json());

// const result = await pb.collection('users').create({
//     name: 'Thomas Bolinger',
//     email: 'bolitj01@pfw.edu',
//     password: 'cs590pfw',
//     passwordConfirm: 'cs590pfw'
// });

const users = await pb.collection('users').getList();
// log(users);

const authData = await pb.collection('users').authWithPassword(
    'bolitj01@pfw.edu',
    'cs590pfw',
);
log(authData.record.id);

const removeAll = await pb.collection('todos').delete

const todoResult = await pb.collection('todos').create({
    name: 'Test Todo',
    completed: false,
    user: authData.record.id,
});

let filterStr = `user = ${authData.record.id}`;

log(filterStr);

// const todos = await pb.collection('todos').getList({
//     filter: filterStr,
// });