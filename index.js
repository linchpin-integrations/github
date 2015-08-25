var GitHubApi = require("github");
var schemas = require('./commands');

var service = {
    "name": "github"
    , "label": "GitHub"
    , "description": "GitHub"
    , "version": "0.0.1"
    , "main": "github.js"
    , "private": true
    , "form_options": null
    , "is_oauth": false
    , "logo": "//linchpin-web-assets.s3.amazonaws.com/v1/integrations/github/logos/github-logo.png"
    , "server_integration": true
    , "frontend_integration": true
    , "supports_webhook": false
};

module.exports = function(options) {
    var lpis = this;

    options = lpis.util.deepextend({
    },options);

    lpis.add({lpi:'github',cmd:'about'},about);
    lpis.add({lpi:'github',cmd:'list'},list);
    lpis.add({lpi:'github',cmd:'getFromOrg'},getFromOrg);

    return {
        name:'github'
    };

    function about (args, done ){
        return done(null,service);
    }

    function list (args, done){
        return done(null, schemas);
    }

    function getFromOrg(args,done){
        var org = args.config.org;
        var github = getApi(args.config);

        github.events.getFromOrg({org:org}, function(err,res){
            if(err){
                return done(err);
            }

            res.forEach(function(entry){
                var t = new Date(entry.created_at);
                entry.LinchPin = {"CreatedTime":t.toISOString()};
            });

            done(null,res);
        });

    }

    function getApi(args){

        var github = new GitHubApi({
            // required
            version: "3.0.0",
            protocol: "https",
            timeout: 3000
        });

        if(args.hasOwnProperty("github") && args.github.hasOwnProperty("token")){
            var token = args.github.token;

            github.authenticate({
                type: "oauth",
                token: token
            });
        }

        return github;
    }
};