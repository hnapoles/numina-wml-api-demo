var express = require('express');
var connect = require('../api/connect');
var perm    = require('../api/perm');
var secret  = require('../api/secret');
var jwt     = require('jsonwebtoken');
var _       = require('lodash');
var router  = express.Router();

router.post('/',fileUpload);

function 
fileUpload(req,res,next) 
{
  var topic      = req.body.topic;
  var action     = req.body.action;
  var params     = req.body.params;
  var admlog     = req.body.log;
  var hasRealLog = !!admlog;
  var token      = req.headers.token;
  
  var logAllWrites = true; // false: logs only actions with log parameter
  var sendTraceMessages = false;

  console.log(req.files);

  //if(topic && action){
  if (1===1) {
    user = 'guest';
    // check for an authenticated user
    if(token){
      try {
        decode = jwt.verify(token,secret.get());
      } catch(error){
        console.log('bad token');
        var err = new Error('bad token');
        err.status = 401;
//        return res.json({tokenError: true, error: err});
        return next(err);
      }
      user = decode.user;
    }
    
    // send trace message
    if(sendTraceMessages){
      if(topic!='heart'){
        console.log('user: '+user+', topic: '+topic+', action: '+action);
      } else if(action=='beat') {
//        console.log(Math.floor(Date.now()/5000)%2?' <3':'<3');
      }
    }
    
    if ( req.files && (Object.keys(req.files).length > 0) ) {
        
      let imageFile = req.files.imageFile;
      req.body.imageFileName = req.files.imageFile.name;
      
      imageFile.mv('./public/images/' + req.files.imageFile.name , function(err) {
        if (err) {
          return res.status(500).send({"returnCode":5,"returnMessage":"File upload error.","errorMessage": err });
        } else {
          console.log('File uploaded!');
          return res.status(200).send({"returnCode":0,"returnMessage":"File uploaded."});
        }
          
        
      });

  }
        
    
  } else {
    var err = new Error('missing topic or action');
    err.status = 404;
    return next(err);
  }
};

module.exports = router;
