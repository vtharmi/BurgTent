const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Recipe = require('./models/recipe');
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
    const user = new User(req.body)
    
    try {
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({ 
            message: "user created",
            user: user,
            token: token });
    } catch (err) {
        if (11000 === err.code) {
            var MongooseError = require('mongoose/lib/error')
            var valError = new MongooseError.ValidationError(err)
            // valError.errors["xxx"] = new MongooseError.ValidatorError('xxx', 'Email already registered. Plse login',err.err)
            valError.message = "Email already registered. Please login"
            err = valError
          }
        logger.error('Error in registering', err.message);
        res.status(500).json({
            "message": err.message
        });
    }
});

app.post('/users/login', async (req, res,next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const AuthTokenUserData = await user.generateAuthToken();
        res.status(200).json({ 
            token: AuthTokenUserData.token,
            userId:  AuthTokenUserData.userId
        });
    } catch (e) {
        logger.error('Error', e);
        res.status(500).json(
            {"message": e.message}
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

app.post('/recipes', auth, async(req, res, next) => {
    const recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.imagePath,
        ingredients: req.body.ingredients,
        creator: req.userData._id
    });
    recipe.save().then(createdRecipe => {
        res.status(200).json({
            message: "recipe fetched successfully",
            recipeId: createdRecipe._id
    })
   
    })
})

app.get('/recipes', async(req, res,next) => {
    await Recipe.find((err, recipes) => {
        if(err) {
            logger.error("Error in retriving recipes", err.message)
            res.status(201).json({
                "error": err.message
            })
        }
        else{
            res.status(200).json({
                "message": "Recipes get successfully",
                "recipes": recipes
            })   
        } 
     });
})

app.get('/recipes/:id', async(req, res, next) => {
     try{
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe) {
            throw new Error();
        }
        res.status(200).json(recipe)
     }catch(e) {
         res.status(201).json({
             message: "Recipe not found"
         })
     }
})

app.delete('/recipes/:id', auth, async(req, res, next) => {
    await Recipe.deleteOne({_id: req.params.id, creator: req.userData._id}, (err, result) => {
        if(err) {
            res.status(201).json({
                "message": err.message
            })
            console.log(err)
        }
        else{
            if(result.n > 0) {
                console.log("deleted recipe", result)

                res.status(200).json({
                    "message": "Recipe was deleted"
                })
            }
            else{
                res.status(401).json({
                    "message": "Not authorized"
                })
            }
        }
    })


})

app.put('/recipes/:id', auth, (req, res, next) => {
    console.log(req.body)
    const recipe = new Recipe({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.imagePath,
        ingredients: req.body.ingredients,
    })
    Recipe.updateOne({_id: req.body.id, creator: req.userData._id}, recipe, (err, result) => {
        if(err) {
            logger.error('Error in updating recipe')
        }
        else {
            if(result.nModified > 0) {
                res.status(200).json({
                    "message": "Recipe is updated",
                    "updatedRecipe": result
                })
            }
            else{
                res.status(401).json({
                    "message": "Authorization denied"                })
            }
        }
    })
})

module.exports = app;