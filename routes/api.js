/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongooseConfig = require("../config/mongoose_config");
var mongo = require('mongodb');
var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var Threads                     = require('./threads')
var obj = new ObjectId();

mongoose.connect(MONGODB_CONNECTION_STRING, mongooseConfig)

module.exports = function (app) {
  
  app
    .route('/api/threads/:board')
    .get(function(req, res) {
    var board = req.params.board;     
    var display_filter = {"board": 0, "reported": 0,"delete_password": 0, "__v":0, "replies.delete_password":0}
    var filter = {}
    
    var threads = new Threads()
    // console.log("GET board:" + board)

    if (board != "general") {
      filter = {'board': board}
    }
    // console.log("GET " +threads._id)
        
    Threads.findOne(filter, display_filter, function(err, data) {
    // Threads.find(filter, display_filter, function(err, data) {      
        if (data) {
          // res.json(data)
    // console.log("GET after filter " +threads._id)
          // res.json({"_id": data[0]._id, "text": data[0].text, "created_on":data[0].created_on, "bumped_on":data[0].bumped_on, "replycount":data[0].replycount, "replies": data[0].replies.slice(0, 3)})
          res.json({"_id": data._id, "text": data.text, "created_on":data.created_on, "bumped_on":data.bumped_on, "replycount":data.replycount, "replies": data.replies.slice(0, 3)})
          // console.log("GET after filter" + JSON.stringify({"_id": data._id, "text": data.text, "created_on":data.created_on, "bumped_on":data.bumped_on, "replycount":data.replycount, "replies": data.replies.slice(0, 3)}))

        } else {
          req.flash("error", err.errors);
        }        
      }).limit(10)
  })  
  
    .post(function(req, res) {
      var board = req.params.board;
      var text = req.body.text;
      var pw = req.body.delete_password      
      var threads = new Threads()

      if (!board || !text || !pw) {
        res.send("Post: Missing required fields")
      } else {
        threads.board = board;
        threads.text = text;
        threads.created_on = new Date(
          parseInt(obj.toString().substr(0, 8), 16) * 1000
        ); 
        threads.bumped_on = new Date(
          parseInt(obj.toString().substr(0, 8), 16) * 1000
        ); 
        threads.delete_password = pw;        
       
        // console.log(threads)
        
        threads.save(function(err, thread) {
          if (err) {
            console.log(err)
            return res.send('Could not save');
          } 
          // console.log(thread)
          // res.redirect('/b/' + board)
                    res.redirect('/b/${board}')

        })
        
               
        // console.log(threads)
      }
  })
  
    .put(function(req, res) {
      var threads = new Threads()       
      var board = req.params.board;
      var id = req.body.thread_id;
      // var reid = req.body.report_id;
      var filter = {'_id': id}    
      
      // console.log(filter)
      Threads.updateOne(filter, {$set: {reported : true}}, function(err, data) {
        
        if (err) {
          // console.log(err)
          res.send("No board or id")
        } else {
          res.send('success')
        }
      })  
    
//       Threads.findOneAndUpdate(filter, {$set: {reported : true}}, function(err, data) {
//                   console.log(data)
//         if (err) {
//           // console.log(err)
//           res.send("No board or id")
//         } else {

//           res.send('success')
//         }
//       })  
      // console.log(threads)
  })
  
    .delete(function(req, res) {
      var board = req.body.board;
      var id = req.body.thread_id;
      var pw = req.body.delete_password;
      var filter = {"_id": id}
      // console.log('del before threads:' + board)
      // console.log('del before threads:' + id)
      // console.log('del before threads:' + pw)
    
      // Threads.findById(id, function(err, data) {   
      
      Threads.findOne(filter, function(err, data) {
        // console.log('log api_delete:' + data)
        if (data.delete_password != pw) {
           res.send("incorrect password")         
        } else {
          Threads.deleteOne(filter, function(err) {
            if(err) {
              res.send("Could not save")
            } else {
              res.send("success")
            }
          })}})
    
      // Threads.deleteMany({}, function(err, alldata) {
      //   if (err) {
      //     return res.send("Could not delete")
      //   } 
      //   return res.send("Deleted successful")
      // })    
    
  })
  
  app
    .route('/api/replies/:board')
    
    .get(function(req, res) {   
      var filter = {};
      var board = req.params.board;
      var thread_id = req.query.thread_id;
          
      if (thread_id) {
        filter = {_id: thread_id}
      }
      if (board != "general") {
        filter = {'board': board}
      }    

      // var display_filter = {"board": 0, "delete_password": 0, "__v":0}    
      var display_filter = {"board": 0, "reported": 0,"delete_password": 0, "__v":0, 'replies.delete_password': 0, 'replies.reported': 0}          
      Threads.findOne(filter, display_filter, function(err, data) {
        if (data) {
          // console.log(data.text)
          // res.send(data);
          res.json({"_id": data._id, "text": data.text, "created_on":data.created_on, "bumped_on":data.bumped_on, "replycount":data.replycount, "replies": data.replies.slice(0, 3)})
          // console.log({"_id": data._id, "text": data.text, "created_on":data.created_on, "bumped_on":data.bumped_on, "replycount":data.replycount, "replies": data.replies.slice(0, 3)})
        } else {
          // console.log(err)
        }
      })    
  })
    
    .post(function(req, res) {
      var board = req.params.board;
      var id = req.body.thread_id;
      var text = req.body.text;
      var pw = req.body.delete_password
      var rep_id = req.params._id
      var threads = new Threads()
     
      if (!board || !id || !text || !pw) {
        console.log("Missing required fields")
        res.send("Replies: Missing required fields")        
      } else {
//         threads.replies.text = text;
//         threads.replies.created_on = new Date(
//           parseInt(obj.toString().substr(0, 8), 16) * 1000
//         ); 
//         threads.replies.delete_password = pw;        
//         threads.replies._id = rep_id        
        
//         Threads.findOneAndUpdate({_id: id}, {$set: threads.replies}, function(err) {
//           if (err) {
//             console.log(err)
//             res.send("Could not reply");            
//           } else {
//             console.log("success")
//           res.redirect('/b/' + board + '/' + id)            
//           }
//         })
        
        Threads.findOne({_id: id}, function (err, thread) {
          if (err) {
            console.log(err)
            res.send("Could not reply");
          } else {
            
            // Threads.updateOne({'_id': id}, {$set: {
            //   'replies._id': new ObjectId(),
            //   'replies.text': text,
            //   'replies.created_on': new Date(parseInt(obj.toString().substr(0, 8), 16) * 1000),
            //   'replies.delete_password': pw}}, function(err) {
            //   if (err) {
            //     console.log(err)
            //     res.send('Could not save')
            //   } else {
            //     console.log(thread)
            //     res.redirect('/b/' + board + '/' + id)  
            //   }
            // })
            thread.replycount = thread.replycount + 1;
            thread.bumped_on = new Date(parseInt(obj.toString().substr(0, 8), 16) * 1000);
            thread.replies.push({
              _id: new ObjectId(),
              text: text,
              created_on: new Date(parseInt(obj.toString().substr(0, 8), 16) * 1000),
              delete_password: pw,
              reported: false
            })
            // console.log('replies post:' + thread)
            thread.save(function(err) {
              if (err) {
                // console.log(err)
                res.send('Could not save')
              } else {
                res.redirect('/b/' + board + '/' + id)  
              }
            })            
          }
        })
        // console.log(threads)
      }
  })

    .put(function(req, res) {
      var threads = new Threads()             
      var board = req.params.board;
      var id = req.body.thread_id;
      var reid = req.body.reply_id;
      var filter = {'_id': id, 'replies._id': ObjectId(reid)}    
      // threads.reported = true;
      // console.log(filter)
      Threads.updateOne(filter, {$set: {'replies.$.reported' : true}}, function(err, thread) {
        if (err) {
          // console.log(err)
          res.send("No board or id")
        } else {
          // console.log(thread)
          res.send('success')
        }
      })  
      // console.log(threads)
  })  
  
    .delete(function(req, res) {
      var board = req.params.board;
      var id = req.body.thread_id;
      var reid = req.body.reply_id;
      var pw = req.body.delete_password;
    
      var threads = new Threads()
      // console.log(threads)
      // var filter = {"board": board, "_id": id, "replies": {"delete_password": pw, "_id": re_id}}
      // var filter = {"board": board, "_id": id, "replies.delete_password": pw, "replies._id": reid}
     
      Threads.find({'replies._id': ObjectId(reid), 'replies.delete_password': pw}, function(err, thread) {
            if (thread=="") {
                res.send('incorrect password')              
            } else {
            Threads.updateOne({'replies._id': ObjectId(reid)}, {$set: {'replies.$.text': "[deleted]"}}, function(err) {          
            // Threads.updateOne({'replies.delete_password': pw}, {$set: {'replies.$.text': "[deleted]"}}, function(err) {
            // Threads.updateOne({'replies.delete_password': pw}, {$set: {'replies': {'text': "[deleted]"}}}, function(err) {
              if (err) {
                // console.log(err)
                res.send('Could not save')
              } else {
                res.send("success")
              }
            })}      
      })     
  })  
};
