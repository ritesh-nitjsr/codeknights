var express = require('express');
var app = express();
var path=require('path');
var expressSession = require('express-session');
var fs=require('fs');
var mongoUrl = 'mongodb://localhost:27017/codeknights';
var MongoStore = require('connect-mongo')(expressSession);
var mongo = require('./mongo');
var port = 1337; 
var bodyParser=require('body-parser');
var spawn=require('child_process').spawn;
var cookieParser=require('cookie-parser');
var router=require('router');
var compiler=require('compilex');


app.use(bodyParser());
app.use(cookieParser());
app.use(router());
app.use(express.static(__dirname+'/bootstrap'));
app.use(express.static(__dirname+'/custom'));
compiler.init({stats:true});
app.set('view engine', 'pug');
app.set('views', './views');

function requireUser(req, res, next){
  if (!req.session.username) {
    res.redirect('/user_unauthorized');
  } else {
    next();
  }
}

// This middleware checks if the user is logged in and sets
// req.user and res.locals.user appropriately if so.
function checkIfLoggedIn(req, res, next){
  if (req.session.username) {
    var coll = mongo.collection('users');
    coll.findOne({username: req.session.username}, function(err, user){
      if (user) {
        // set a 'user' property on req
        // so that the 'requireUser' middleware can check if the user is
        // logged in
        req.user = user;
        
      }
      
      next();
    });
  } else {
    next();
  }
}

app.use( expressSession({
  secret: 'somesecretrandomstring',
  store: new MongoStore({
    url: mongoUrl
  })
}));

// We must use this middleware _after_ the expressSession middleware,
// because checkIfLoggedIn checks the `req.session.username` value,
// which will not be available until after the session middleware runs.
app.use(checkIfLoggedIn);

app.get('/', function(req, res){
  if(req.session.username)
  {
    res.redirect('/dashboard');
  }
  else
   {
    res.redirect('/login');
   } 
});

app.get('/login', function(req, res){
  if(req.session.username)
  {
      res.sendFile('session_active.html',{root: path.join(__dirname,'./')});  
  }
  else res.sendFile('login.html',{root: path.join(__dirname,'./')});
});


app.get('/invalid_credentials', function(req, res){

  res.sendFile('invalid_credentials.html',{root: path.join(__dirname,'./')});
});


app.get('/user_unauthorized', function(req, res){
  res.sendFile('user_unauthorized.html',{root: path.join(__dirname,'./')});
});

//we store all the details of the question in text files at location problems/<problem_code>

//Custom read function to read the contents of the text files in desired format
var read=function(location,filename){
  var ret="";
  fs.readFileSync('./problems/'+location+'/'+filename+'.txt').toString().split('\n').forEach(function (line) { 
    ret=ret+line.toString()+"<br>";
   });  
   return ret;
};

//If you want to add mode questions, then first add the required text files at problems/<code_name>.
//Then either use a for loop or use different codes for different questions as done here. 
app.get('/dashboard/code1',requireUser,function(req,res){
   var problem_name=read('code1','problem_name');
   var problem_statement=read('code1','problem_statement');
   var problem_code=read('code1','problem_code');
   var input_format=read('code1','input_format');
   var output_format=read('code1','output_format');
   var constraints=read('code1','constraints');
   var sample_input=read('code1','sample_input');
   var sample_output=read('code1','sample_output');
   var problem_code=fs.readFileSync('./problems/code1/problem_code.txt').toString();
   res.render('problem',{username:req.session.username, problem_name:problem_name, problem_code:problem_code, problem_statement:problem_statement,input_format:input_format,output_format:output_format,constraints:constraints,sample_input:sample_input,sample_output:sample_output});
});

app.get('/dashboard/code2',requireUser,function(req,res){
   var problem_name=read('code2','problem_name');
   var problem_statement=read('code2','problem_statement');
   var problem_code=read('code2','problem_code');
   var input_format=read('code2','input_format');
   var output_format=read('code2','output_format');
   var constraints=read('code2','constraints');
   var sample_input=read('code2','sample_input');
   var sample_output=read('code2','sample_output');
   var problem_code=fs.readFileSync('./problems/code2/problem_code.txt').toString();
   res.render('problem',{username:req.session.username, problem_name:problem_name, problem_code:problem_code, problem_statement:problem_statement,input_format:input_format,output_format:output_format,constraints:constraints,sample_input:sample_input,sample_output:sample_output});
});

app.get('/dashboard/code3',requireUser,function(req,res){
   var problem_name=read('code3','problem_name');
   var problem_statement=read('code3','problem_statement');
   var problem_code=read('code3','problem_code');
   var input_format=read('code3','input_format');
   var output_format=read('code3','output_format');
   var constraints=read('code3','constraints');
   var sample_input=read('code3','sample_input');
   var sample_output=read('code3','sample_output');
   var problem_code=fs.readFileSync('./problems/code3/problem_code.txt').toString();
   res.render('problem',{username:req.session.username, problem_name:problem_name, problem_code:problem_code, problem_statement:problem_statement,input_format:input_format,output_format:output_format,constraints:constraints,sample_input:sample_input,sample_output:sample_output});
});



app.get('/dashboard/code1/submit',requireUser,function(req,res){
   var problem_name=read('code1','problem_name');
   var problem_code=fs.readFileSync('./problems/code1/problem_code.txt').toString();
   res.render('submit',{username:req.session.username,problem_name:problem_name,problem_code:problem_code});
});


app.get('/dashboard/code2/submit',requireUser,function(req,res){
   var problem_name=read('code2','problem_name');
   var problem_code=fs.readFileSync('./problems/code2/problem_code.txt').toString();
   res.render('submit',{username:req.session.username,problem_name:problem_name,problem_code:problem_code});
});


app.get('/dashboard/code3/submit',requireUser,function(req,res){
   var problem_name=read('code3','problem_name');
   var problem_code=fs.readFileSync('./problems/code3/problem_code.txt').toString();
   res.render('submit',{username:req.session.username,problem_name:problem_name,problem_code:problem_code});
});


app.get('/dashboard', requireUser, function(req, res){
  res.render('dashboard', {username: req.session.username});
});

app.get('/register', function(req,res){

  if(req.session.username)
  {
    console.log(req.session.username);
     res.sendFile('session_active.html',{root: path.join(__dirname,'./')}); 
  }
  else res.sendFile('register.html',{root: path.join(__dirname,'./')});
});


app.get('/username_exist', function(req,res){
  res.sendFile('username_exist.html',{root: path.join(__dirname,'./')});
});


app.get('/registration_successful', function(req,res){
  res.sendFile('registration_successful.html',{root: path.join(__dirname,'./')});
});

// This creates a new user and calls the callback with
// two arguments: err, if there was an error, and the created user
// if a new user was created.
//
// Possible errors: the passwords are not the same, and a user
// with that username already exists.
function createUser(name, username, email, password, callback){
  var coll = mongo.collection('users');
  
  
    var query      = {username:username};
    var userObject = {name : name, username: username, email : email, password: password, };
    
    // make sure this username does not exist already
    coll.findOne(query, function(err, user){
      if (user) {
        err = 'The username you entered already exists';
        callback(err);
      } else {
        // create the new user
        coll.insert(userObject, function(err,user){
          callback(err,user);
        });
      }
    });
  
}

app.get('/ranklist',requireUser,function(req,res){
   var coll=mongo.collection('ranklist');
   coll.find().sort({score:-1}).toArray(function(err, user){
    //console.log(user);
    if(err) res.sendFile('/page_not_found.html',{root: path.join(__dirname,'./')});
    else
    res.render('ranklist',{ list : user , username : req.session.username});
  }); 
});


app.post('/register', function(req, res){
  var username = req.body.username;
  var name=req.body.name;
  var password = req.body.password;
  var email=req.body.email;


  
  createUser(name, username, email, password, function(err, user){
    if (err) {
      res.redirect('/username_exist');
    } else {
      
      res.redirect('/registration_successful');  
    }
  });
});

// This finds a user matching the username and password that
// were given.
function authenticateUser(username, password, callback){
  var coll = mongo.collection('users');
  
  coll.find({username: username, password:password}).toArray(function(err, user){
    callback(err, user);
  }); 
} 

app.post('/logout', function(req,res){
   delete req.session.username;
   res.redirect('/login');
});


app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
  authenticateUser(username, password, function(err, user){
    if (user.length) {
      // This way subsequent requests will know the user is logged in.
      req.session.username = user[0].username;
      res.redirect('/dashboard');
    } else {
      res.redirect('/invalid_credentials');
    }
  });
});


//This code updates the ranklist, whenever a user submits a answer
function updateRanklist(username,code,result)
{
    var coll=mongo.collection('ranklist');
    coll.find({username: username}).toArray(function(err, user){
      if(err) console.log(err);

      else
       {
           if(!user.length){
            //user is not on the ranklist
            var ac=0;
            var wa=0;
            var sc=0;
            var code1='-';
            var code2='-';
            var code3='-';
            if(result==='Wrong Answer') {
                if(code==='code1')
                {
                  code1='WA';
                  wa=wa-1;
                }

                if(code==='code2')
                {
                  code2='WA';
                  wa=wa-1;
                }

                if(code==='code3')
                {
                  code3='WA';
                  wa=wa-1;
                } 

                sc=sc-50;
            }
            if(result==='Answer Correct') {
                if(code==='code1')
                {
                  code1='AC';
                  ac=ac+1;
                  sc=sc+100;
                }

                if(code==='code2')
                {
                  code2='AC';
                  ac=ac+1;
                  sc=sc+100;
                }

                if(code==='code3')
                {
                  code3='AC';
                  ac=ac+1;
                  sc=sc+100;
                } 

            }

            userObject={username : username, WA : wa, AC : ac, score : sc, code1 : code1, code2 : code2, code3 : code3};
            console.log(userObject);
            coll.insert(userObject,function(err,user){
             if(err) console.log(err);
             else console.log('Ranklist Updated');
            });
           }

           else
           {
            //user is already on the ranklist
            var ac=user[0].AC;
            var wa=user[0].WA;
            var sc=user[0].score;
            var code1=user[0].code1;
            var code2=user[0].code2;
            var code3=user[0].code3;
            if(result==='Wrong Answer') { 

              if(code==='code1')
              {
                if(code1==='-')
                {
                  code1='WA';
                  sc=sc-50;
                }
                wa=wa+1;
              }

              if(code==='code2')
              {
                if(code2==='-')
                {
                  code2='WA';
                  sc=sc-50;
                }
                wa=wa+1;
              }

              if(code==='code3')
              {
                if(code3==='-')
                {
                  code3='WA';
                  sc=sc-50;
                }
                wa=wa+1;
              }
              
            }
            if(result==='Answer Correct') { 
              
              if(code==='code1')
              {
                if(code1==='-' || code1==='WA') sc=sc+100;
                code1='AC'; 
              }

              if(code==='code2')
              {
                if(code2==='-' || code2==='WA') sc=sc+100;
                code2='AC'; 
              }

              if(code==='code3')
              {
                if(code3==='-' || code3==='WA') sc=sc+100;
                code3='AC'; 
              } 
            }
            userObject={username : username, WA : wa, AC : ac, score : sc, code1 : code1, code2 : code2, code3 : code3};
            console.log(userObject);
            coll.remove({username : username}, function(err,user){
               if(err) console.log(err);
            });
            coll.insert(userObject,function(err,user){
             if(err) console.log(err);
            }); 
           }  
           
       } 
    });
}

//This part compiles the code submited by the user for a problem. Here we could have used a for loop.
app.post('/dashboard/code1/result',function(req,res){
  var envData = { OS : "windows" , cmd : "g++"};
  var code=req.body.code;
  var problem_name=req.body.problemName;
  var result="";
  var status="";
  console.log(code);
  var input=fs.readFileSync('./problems/code1/input.txt').toString();
  var output=fs.readFileSync('./problems/code1/output.txt').toString();
  compiler.compileCPPWithInput(envData , code, input , function (data) {
        if(data.error)
        {
          console.log(data.error);	
          result="Compilation Error : " + data.error;
          status="warning";
        }

        else
        {
            if(data.output===output)
            {
                result="Answer Correct";
                status="success";
            }

            else
            {
                result="Wrong Answer";
                status="danger";
            }
        }
        updateRanklist(req.session.username,'code1',result);
        res.render('result',{username:req.session.username,result:result,type:status,problem_name:"Result of Submited Code:",problem_code:'code1'});
    });
      
});






app.post('/dashboard/code2/result',function(req,res){
  var envData = { OS : "windows" , cmd : "g++"};
  var code=req.body.code;
  var problem_name=req.body.problemName;
  var result="";
  var status="";
  var input=fs.readFileSync('./problems/code2/input.txt').toString();
  var output=fs.readFileSync('./problems/code2/output.txt').toString();
  compiler.compileCPPWithInput(envData , code, input , function (data) {
        if(data.error)
        {
          result="Compilation Error";
          status="warning";
        }

        else
        {
            if(data.output===output)
            {
                result="Answer Correct";
                status="success";
            }

            else
            {
                result="Wrong Answer";
                status="danger";
            }
        }
        updateRanklist(req.session.username,'code2',result);   
        res.render('result',{username:req.session.username,result:result,type:status,problem_name:"Result of Submited Code:",problem_code:'code2'});
    });
    
});


app.post('/dashboard/code3/result',function(req,res){
  var envData = { OS : "windows" , cmd : "g++"};
  var code=req.body.code;
  var problem_name=req.body.problemName;
  var result="";
  var status="";
  var input=fs.readFileSync('./problems/code3/input.txt').toString();
  var output=fs.readFileSync('./problems/code3/output.txt').toString();
  compiler.compileCPPWithInput(envData , code, input , function (data) {
        if(data.error)
        {
          result="Compilation Error";
          status="warning";
        }

        else
        {

            if(data.output===output)
            {
                result="Answer Correct";
                status="success";
            }

            else
            {
                result="Wrong Answer";
                status="danger";
            }
        }
        updateRanklist(req.session.username,'code3',result);
        res.render('result',{username:req.session.username,result:result,type:status,problem_name:"Result of Submited Code:",problem_code:'code3'});
    });
      
});

mongo.connect(mongoUrl, function(){
  console.log('Connected to mongo at: ' + mongoUrl);
  app.listen(port, function(){
    console.log('Server is listening on port: '+port);
  });  
});
