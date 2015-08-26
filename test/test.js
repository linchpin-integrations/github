var assert = require("chai").assert; // node.js core module
var getenv = require('getenv');

describe('github',function(){

    var seneca = require('seneca')();
    seneca.use('..');

    describe('getFromOrg',function(){
        it('should retrieve org events from github',function(done){
            var token = getenv('GITHUB_TOKEN','');

            var req =  {lpi:'github', cmd:'getFromOrg', config:{org:'linchpin-integrations'}};

            if (token != ''){
                req.github = {name:"Lp",token:token };
            }

            seneca.act(req, function(err,result){
                console.log( '%j', result );
                assert.isArray(result,'result is an Array');
                done();
            });
        })
    });

    describe('about',function(){
        it('should return integration properties',function(done){
            seneca.act( {lpi:'github', cmd:'about'}, function(err,result){
                console.log( '%j', result );
                assert.isObject(result,'result is an object');
                assert.equal(result.name,'github','name is github');
                done();
            });
        })
    });


    describe('list',function(){
        it('should return a command\'s json schema',function(done){
            seneca.act({lpi:'github',cmd:'list'}, function(err,list){
                console.log('%j',list);
                assert.isObject(list,'list is object');
                done();
            });
        });
    });
});
