const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/user');
const auth = require('./middleware/auth');
const bcrypt = require('bcryptjs');

const log4js = require('log4js');
log4js.configure({
    appenders: { book: { type: 'file', filename: 'logs/classifier_be.log' }, out: { type: 'stdout' } },
    categories: { default: { appenders: ['book', 'out'], level: 'debug' } }
});
const logger = log4js.getLogger('book');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "PUT,DELETE, POST, GET, OPTIONS"
    )
    next();
  });


// app.options('/users/storeRecipes', cors())

app.post('/users/signUp', async (req, res,next) => {
    console.log(req.body)
    const user = new User(req.body)
    
    try {
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({ 
            message: "user created",
            user: user,
            token: token });
    } catch (e) {
        logger.error('Error in registering', e);
        res.status(500).json({ error: e});
    }
});

app.get('/users/me', auth, async (req, res,next) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

app.post('/users/login', async (req, res,next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        logger.error('Error', e);
        res.status(500).json(
            {"message": e}
        )
    }
})

app.post('/users/logout', auth, async (req, res,next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.send(e);
    }
})

app.post('/users', cors(), async(req, res,next) => {
    res.send(req.body);
})

// let storage = multer.diskStorage({
//     destination: ((req, file, callback) => {
//         callback(null, './backend/uploads');
//     }),
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now());
//     }
// });
// const upload = multer({ storage: storage });
// app.post('/users/me/upload', upload.single('userFile'), async(req, res) => {
//     try {
//         if (!req.file) {
//             console.log("No file received");
//             return res.send({
//               success: false
//             });
        
//           } else {
//             console.log('file received successfully');
//             return res.send({
//               success: true
//             })
//           }
//     } catch (e) {
//         res.send(e)
//     }
// })

// app.listen(3000, (err) => {
//     if (err) {
//         return logger.error(err);
//     }
//     console.log('Server is running on port 3000');
// })

module.exports = app;