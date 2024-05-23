// intial set up for express server
// make sure to add in req?.body?.field to prevent crashing. 
const { json, response, query } = require("express");
const express = require("express");
const app = express();
const port = 4131;
const session = require('express-session');
const database = require("./data.js");
// configuration for pug templating
app.set("views","templates");
app.set("view engine","pug");

// set up for bycrpt
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.static('resources'))


//middlewear set up 
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// middlewar set up for express-ssion
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// middleware to test if user is authenticated
function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect('/join');
}
// middlwear to redirect user in a special case. Only used on one route 
function isAuthenticated2 (req, res, next){
  if(req.session.user != undefined){
    console.log("we have an active session so redirect to /");
    res.redirect('/');
  }
  else{
    next();
  }
}


app.get('/', isAuthenticated,async (req, res) =>{
  // this is only called when there is an authentication user due to isAuthenticated
  // get all of the posts
  let user_id = req.session.user;
  let page = parseInt(req.query.page ?? 1)
  let order = req.query.order;
  if (! page) {
      // this should catch "Nan" from a bad parseInt
      page = 1;
  }
  let offset = (page-1) * 10;
  if(order=="hot"){
    let posts = await(await database.getAllPostsHot()).slice(offset,offset+ 10);
    res.render("mainpage.pug",{posts,page,order,user_id});
  }
  else{// default we load by the most recent posts
    order = "recent";
    let posts = await (await database.getAllPostsRecent()).slice(offset,offset + 10);
    res.render("mainpage.pug",{posts,page,order,user_id})
  }
})

app.get('/join',isAuthenticated2, (req,res)=>{
  res.render("landingPage.pug");
})

app.get('/register',(req,res)=>{
  res.render('register.pug');
})
app.post('/register',async (req,res)=>{
  // register the user here
  if (req?.body?.email == undefined | req?.body?.username == undefined | req?.body?.password == undefined){
      res.status(400).render("registerError.pug",{message:"Not enough info provided to register"});
  }
  else{
    // we will check to see that the username is unique
    const result = await database.getUser(req.body);
    if(result.length >0){// we have a user with that account
      console.log("A user with that account exists");
      res.status(400).render("registerError.pug",{message: "Try another username"});
    }
    else{
      // we will create the username
      const pass = await bcrypt.hash(req.body.password,saltRounds);
      console.log(pass);
      const userData = {
        email: req.body.email,
        username: req.body.username,
        p_hash: pass,  
      }
      console.log(userData);
      const queryResult = await database.addUser(userData);
      if(queryResult){
        console.log("success you registered a new user");   
        req.session.regenerate(function (err) {
          if (err) next(err);
          // store user information in session, typically a user id
          req.session.user = queryResult[0].id;
          // save the session before redirection to ensure page
          // load does not happen before session is saved
          req.session.save(function (err) {
          if (err) return next(err);
          res.redirect('/');
          })
      })
    }
    else{
      console.log("there was an error with the database query");
      res.redirect("/register");
    }
  }
  }
})
app.get('/login',isAuthenticated2,(req,res)=>{
  res.render("loginPage.pug");
})

app.post('/login', express.urlencoded({ extended: true }), async (req, res)=> {
// login logic to validate req.body.user and req.body.pass
// would be implemented here. for this example any combo works
  if (req?.body?.username == undefined | req?.body?.password == undefined){
    console.log("The user has not provided all the neceessary info to login");
    res.status(400).render("LoginError.pug",{message:"Not enought info provided to login"});
  }
  else{
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    // check to see if that is a valid user
    const result = await database.getUser(req.body)
    if(result.length > 0 && result[0].id != undefined){
      // check with bycrpt that the user provided the correct password
      const valid = await bcrypt.compare(req.body.password,result[0].p_hash);
      if(valid){
        req.session.regenerate(function (err) {
            if (err) next(err)
            // store user information in session, typically a user id
            req.session.user = result[0].id
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
            if (err) return next(err)
            res.redirect('/')
            })
        })
      }
      else{
        res.status(400).render("LoginError.pug",{message:"invalid username or password provided"});
      }
    }
    else{
      res.redirect('/login');
    }
  }
})

app.get('/createPost',isAuthenticated,(req,res)=>{
  res.render("createPost.pug",{user_id:req.session.user});
})

app.post('/api/createPost',isAuthenticated, async (req,res)=>{
  res.setHeader('content-type','text/plain');
  let content = req?.body?.content;
  if(content != undefined && content.length<100){
    // we will try and add the post to the databasev
    const data = {
      content: content,
      likes: 0,
      author: req.session.user,
    }
    let queryResult = await database.addPost(data);
    if(queryResult){
      res.status(200).send("success at addingPost");
    }
    else{
      res.status(400).send("failed to add post to database. try again later");
    }
  }
  else{
    res.status(400).send("you must actually provide content for us to add a post");
  }
  
})
app.delete('/api/deletePost',isAuthenticated,async (req,res)=>{
  res.setHeader('content-type','text/plain');
  let post_id = req?.body?.id;
  if(post_id != undefined){
    // try and delete the post
    let data = {
      post_id: post_id,
      user_id: req.session.user,

    }
    let queryResult = await database.deletePost(data);
    if(queryResult){
      res.status(200).send("success you deleted the post");
    }
    else{
      res.status(400).send("the post was not able to be deleted");
    }
  }
  else{
    res.status(400).send("there was no post id provided so we coulnd't delete a post");
  }
})

app.put('/api/editPost',isAuthenticated, async (req,res)=>{
  res.setHeader('content-type','text/plain');
  let post_id = req?.body?.id;
  let content = req?.body?.content;
  if(post_id != undefined | content !=undefined){
    // try and delete the post
    let data = {
      post_id: post_id,
      content: content,
      user_id: req.session.user,

    }
    let queryResult = await database.editPost(data);
    if(queryResult){
      res.status(200).send("success you deleted the post");
    }
    else{
      res.status(400).send("the post edit was not succesful");
    }
  }
  else{
    res.status(400).send("there was no post id provided so we coulnd't edit a post");
  } 
})

app.put('/api/likePosts',isAuthenticated,async(req,res)=>{
  res.setHeader('content-type','text/plain');
  let id = req?.body?.id;
  if(id != undefined){// check to see that the post id was not empty
    // we will try to update the post like count
    let data = {
      id: id,
    }
    let queryResult = await database.updatePostLikeCount(data);
    if(queryResult){// we have a valid post update so return success
      res.status(200).send("success you updated the post like count");
    }
    else{
      res.status(400).send("the post coulnd't be udpated")
    }
  }
  else{
    // you must provide a valid post id, we will set this up later
    res.status(400).send("you must send a valid post id");
  }
})

app.get('/users/:userId',isAuthenticated,async (req,res)=>{
    if(req.params.userId == req.session.user){
      let user_id = req.session.user;
      let queryResult = await database.getUsername({id:user_id});
      if(queryResult.length > 0){
        res.render('clientAccountHomePage.pug',{user_id,username:queryResult[0].username});
      }
      else{
        res.render('404.pug');
      }
      
    }
    else{
      res.render('404.pug');
    }
})
app.get('/users/:userId/myPosts',isAuthenticated,async (req,res)=>{
  if(req.params.userId == req.session.user){
    const data = {
      user_id: req.session.user,
    }
    let user_id = req.session.user;
    let page = parseInt(req.query.page ?? 1)
    if (! page) {
        // this should catch "Nan" from a bad parseInt
        page = 1;
    }
    let offset = (page-1) * 10;
    let posts = await (await database.getUserPosts(data)).slice(offset,offset + 10);
    res.render("clientPosts.pug",{posts,page,user_id})
  }
  else{
    res.render("404.pug");
  }
})
app.get('/logout',isAuthenticated,(req,res,next)=>{

  res.render('logout.pug',{user_id: req.session.user});
});
app.post('/logout', function (req, res, next) {
  // this code was taken from the npm documentation of express-session
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})


app.use((req, res, next) => {
    res.status(404).render("404.pug");
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})

