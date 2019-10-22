/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var bd1 = 'board1';
  var bd2 = "board2";
  var tid1;
  var tid2;
  var pw1 = "pw1";
  var pw2 = "pw2";
  var rid1;
  var rid2;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Thread Post', function(done){
       chai.request(server)
        .post('/api/threads/' + bd1)
        .send({
          board: bd1,
          text: 'text1',
          delete_password: pw1
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         // expect(res).to.redirect;
         // done();
        });      
       chai.request(server)
        .post('/api/threads/' + bd2)
        .send({
          board: bd2,
          text: 'text2',
          delete_password: pw2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         // expect(res).to.redirect;
         done();
        });              
      });
    });
    
    suite('GET', function() {
      test('Get all information for Posts', function(done) {
        chai.request(server)
        .get('/api/threads/' + bd1)
        .end(function(err, res){
          assert.equal(res.status, 200);
          // assert.isArray(res.body);
          // assert.property(res.body[0], 'reported');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'replycount');
          assert.property(res.body, '_id');
          // assert.property(res.body[0], 'board');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          // assert.property(res.body[0], 'delete_password');
          // done();
          tid1 = res.body._id
          // console.log('get:' + res.body[0].delete_password)
          // console.log(tid1)
        });
        chai.request(server)
        .get('/api/threads/' + bd2)
        .end(function(err, res){
          assert.equal(res.status, 200);
          // assert.isArray(res.body);
          // assert.property(res.body[0], 'reported');
          assert.property(res.body, 'replies');
          assert.property(res.body, 'replycount');
          assert.property(res.body, '_id');
          // assert.property(res.body[0], 'board');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          // assert.property(res.body[0], 'delete_password');

          tid2 = res.body._id
          // console.log('Thread Post2:' + tid2)
          done();
          // console.log('get:' + res.body[0].delete_password)
          // console.log(tid2)
        });        
      });      
    });
    
    suite('DELETE', function() {
      test('Delete Thread', function(done) {
        // console.log('delete:' + tid)
        // console.log('delete:' + pw)
        chai.request(server)
        .delete('/api/threads/' + bd1)
        .send({
          board: bd1,
          thread_id: tid1,
          delete_password: pw1
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success')        
          done();
        });               
      });      
    });
    
    suite('PUT', function() {
      test('Reported Thread', function(done) {
        chai.request(server)
        .put('/api/threads/' + bd2)
        .send({
          board: bd2,
          thread_id: tid2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "success")
          
          done();
        });          
      });      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Reply Post', function(done){
        // console.log('Reply Post:' + tid2)
        // console.log(bd2)
       chai.request(server)
        .post('/api/replies/' + bd2)
        .send({
          board: bd2,
          thread_id: tid2,
          text: 'subtext2',
          delete_password: pw2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
         // expect(res).to.redirect;
         done();
        });      
      })      
    });
    
    suite('GET', function() {
      test('Get all information for replies', function(done) {
        chai.request(server)
        .get('/api/replies/' + bd2)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'replycount');
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.isArray(res.body.replies);
          assert.property(res.body.replies[0], '_id');
          assert.property(res.body.replies[0], 'text');
          assert.property(res.body.replies[0], 'created_on');
          rid2 = res.body.replies[0]._id
          done();
          // console.log('get:' + res.body[0].delete_password)
          // console.log(tid)
        });
      });        
    });
    
    suite('PUT', function() {
      test('Reported Thread', function(done) {
        chai.request(server)
        .put('/api/replies/' + bd2)
        .send({
          board: bd2,
          thread_id: tid2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "success")
          
          done();
        });          
      });           
    });
    
    suite('DELETE', function() {
      test('Delete Reply', function(done) {
        // console.log('delete:' + tid)
        // console.log('delete:' + pw)
        chai.request(server)
        .delete('/api/replies/' + bd2)
        .send({
          board: bd2,
          thread_id: tid2,
          reply_id: rid2,
          delete_password: pw2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success')        
          done();
        });               
      });         
    });
    
  });

});
