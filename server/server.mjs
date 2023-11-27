import PocketBase from 'pocketbase';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const pb = new PocketBase("http://127.0.0.1:8090");

const app = express();

// Get __dirname in es6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildFolder = "../client/dist";

// Server React build folder
app.use(express.static(path.join(__dirname, buildFolder)));

//JSON body parser
app.use(express.json());
app.use(cors());

// Serve React entrypoint index.html
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, buildFolder, 'index.html'));
});

//create user
app.post('/signup', async (req, res) => {
    const result = await pb.collection('users').create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    res.json(result);
});

//login user
app.post('/login', async (req, res) => {
    const result = await pb.collection('users').authWithPassword(
        req.body.email,
        req.body.password,
    );
    res.json(result);
});

//get todos
app.get('/todos', async (req, res) => {
    try {
        // const authData = await pb.collection('users').authWithToken(
        //     req.headers.authorization,
        // );
        const todos = await pb.collection('todos').getList(1, 50, {
            filter: `user = "hvqhq4z4yzj256u"`,
        });
        res.json(todos);
    } catch (error) {
        console.log('error: ', error);
        res.json(error);
    }
});

//create todo
app.post('/create-todo', async (req, res) => {
    // const authData = await pb.collection('users').authWithToken(
    //     req.headers.authorization,
    // );
    const todoResult = await pb.collection('todos').create({
        name: req.body.name,
        completed: false,
        user: "hvqhq4z4yzj256u",
    });
    res.json(todoResult);
});

//get todos
app.get('/todos', async (req, res) => {
    // const authData = await pb.collection('users').authWithToken(
    //     req.headers.authorization,
    // );
    const todos = await pb.collection('todos').getList(1, 50, {
        filter: `user = "hvqhq4z4yzj256u"`,
    });
    res.json(todos);
});

//toggle todo completeness
app.put('/toggle-todo', async (req, res) => {
    // const authData = await pb.collection('users').authWithToken(
    //     req.headers.authorization,
    // );
    const todoResult = await pb.collection('todos').update(
        req.body.id,
        {
            completed: req.body.completed,
        },
    );
    res.json(todoResult);
});

//delete todo
app.delete('/delete-todo', async (req, res) => {
    // const authData = await pb.collection('users').authWithToken(
    //     req.headers.authorization,
    // );
    const todoResult = await pb.collection('todos').delete(req.body.id);
    res.json(todoResult);
});

//start server
app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});