var fs = require("fs");
var http = require("http");
var url = require("url");
var mime = require("mime-types");
var path = require("path");
var qs = require('querystring');
var sql = require('sqlite3').verbose();
var db = new sql.Database("VulnWebsiteData.db");


var server = http.createServer(handleRequest); 
var commentsList = [];
var allowedPaths = ["/login.html","/js/login2.js","/favicon.ico"]
const ROOT = "./public";

server.listen(3003);

console.log("listening on port 3003")


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function handleRequest (req, res) {
    console.log(req.method + " request for: " + req.url);
    var urlObj = url.parse(req.url);
    var fileName = ROOT+urlObj.pathname;

    allowed = false;
    for (i = 0 ; i < allowedPaths.length ; i++) {
        if (allowedPaths[i]  == urlObj.pathname) {
            allowed = true;
        }
    }
    if (allowed == false) {
        checkIfLoggedOn();
    }
    if (req.method == "GET") {
        handleGetRequest(urlObj);
    } else if (req.method == "POST") {
        handlePostRequest ();
    }

    function checkIfLoggedOn() {
        if (req.headers.cookie) {
            var stmt = db.prepare("SELECT username,cash FROM LoginData WHERE ID = (?)");
            stmt.get(req.headers.cookie,function(err,row) {
                if (err) {
                    respondErr(err);
                } else if (row != undefined) {
                    return;
                } else {
                    respond(301,"","","/login.html");
                    if (row.username != undefined && row.cash != undefined) {
                        respondData = {
                            'user': row.username,
                            'cash': row.cash
                        };
                    } else {
                        respondData = {
                            'user': 'undefined',
                            'cash': 12
                        };
                    }
                    respondData = JSON.stringify(respondData);
                    respond(200,respondData);
                }
            });
        } else {
            respond(301,"","","/login.html");
        }
    }

    function handleStaticFile(err, stats) {
        if (err) {
            respondErr(err);
        } else if (stats.isFile()){
            fs.readFile(fileName,function(err,data)
            {
                if (err) 
                {
                    respondErr(err);
                } else
                {
                    respond(200,data);
                }
            });
        }
    }

    function handleStaticFileRedirect(err, stats) {
        if (err) {
            respondErr(err);
        } else if (stats.isFile()){
            fs.readFile(fileName,function(err,data)
            {
                if (err) 
                {
                    respondErr(err);
                } else
                {
                    console.log(data);
                    respond(301,data);
                }
            });
        }
    }

    function sendBackUserList() {
        var userArray = new Array();
            db.get("SELECT count(*) AS count FROM LoginData", function(err,count) {
                if (err) {
                    respondErr(err);
                }
                else {
                    var users_returned = 6;
                    var internalcounter = 0;
                    for (var i =0 ; i < users_returned ; i++) {
                        randomUser = getRandomInt(2,count.count);
                        db.get("SELECT username FROM LoginData WHERE rowid = " + randomUser + ";", function (err,row) {
                            internalcounter++;
                            if (err) {
                                respondErr(err);
                            } else {
                                if (row != undefined) {
                                    userArray.push(row.username);
                                    if (internalcounter == users_returned)
                                        respond(200,JSON.stringify(userArray))
                                }
                            }
                        });
                    }
                }
            });
    }
    //prepared statement stops SELECT * FROM LoginData WHERE username = 'a' OR 1=1;-- -' AND password = '';
    function checkLoginData(username,password) {
        var stmt = db.prepare("SELECT * FROM LoginData WHERE username = (?) AND password = (?)");
        stmt.get([username,password],function(err,row) {
            if (err)
            {
                respondErr(err);
            } else if (row != undefined) {
                fileName = ROOT+"/home.html";
                var row_cookie = row.ID;
                fs.stat(fileName, function(err,stats) {
                    if (err) {
                        respondErr(err);
                    } else if (stats.isFile()){
                        fs.readFile(fileName,function(err,data)
                        {
                            if (err) 
                            {
                                respondErr(err);
                            } else
                            {
                                respond(301,"",row_cookie,"/home.html");
                            }
                        });
                    }
                });
            } else {
                respond(401, "invalid login");
            }
        });
    }

    function sendBackUserData() {
        console.log(req.headers.cookie);
        var stmt = db.prepare("SELECT username,cash FROM LoginData WHERE ID = (?)");
        stmt.get(req.headers.cookie,function(err,row) {
            if (err) {
                respondErr(err);
            } else if (row != undefined) {
                respondData = {
                    'user': row.username,
                    'cash': row.cash
                };
                if (respondData.user == "Admin"){
                    respondData.user = "flag{aec9f7f4609633dceb7af058e8c326c2}"
                }
                if (respondData.cash >= 1000) {
                    respondData.cash = "flag{96dd98d386702b0d1c9454889986fc02}"
                }
                respondData = JSON.stringify(respondData);
                respond(200,respondData);
            } else {
                respondData = {
                    'user': "unknown",
                    'cash': "unknown"
                }
                respondData = JSON.stringify(respondData);
                respond(200,respondData);
            }
        });
    }

    function loggedInUsersData(callback) {
        if (req.headers.cookie) {
            var stmt = db.prepare("SELECT username,cash FROM LoginData WHERE ID = (?)");
            stmt.get(req.headers.cookie,function(err,row) {
                if (err) {
                    respondErr(err);
                } else if (row != undefined) {
                    return callback({
                        username : row.username,
                        cash : row.cash
                    })
                }
                else {
                    return callabck({
                        username : "",
                        cash : 0
                    })
                }
            });
        }
    }

    function transferFunds (postData) {
        if (postData.username != null && postData.funds != null) {
            try {
                postData.funds = parseInt(postData.funds);
            } catch (err) {
                respondErr(err);
            }
            if (postData.funds >= 0) {
                    var stmt = db.prepare("SELECT username, cash FROM LoginData WHERE username = (?)");

                    stmt.get(postData.username,function(err,row) {
                        if (err) {
                            console.log(err);
                            respondErr(err);
                        } else if (row != undefined) {
                            loggedInUsersData(function(loggedInData) {
                                if (postData.funds <= loggedInData.cash) {
                                    var stmt = db.prepare("UPDATE LoginData SET cash = (?) WHERE username = (?)");
                                    transferedCash = row.cash + postData.funds;
                                    reducedCash = loggedInData.cash - postData.funds;
                                    stmt.run([transferedCash,row.username], function(err) {
                                        if (err) {
                                            respondErr(err)
                                        } else {
                                            stmt.run([reducedCash,loggedInData.username], function(err) {
                                                if (err) {
                                                    respondErr(err)
                                                } else {
                                                    respond(301,"","","/challange4transfercompleted.html");
                                                }
                                            });
                                        }
                                    })
                                } else {
                                    respond(301,"","","/challange4transferincomplete.html");
                                }
                            });
                        }
                    });
                } else {
                    respond(301,"","","/challange4transferincomplete.html");
                }
        } else {
            respond(301,"","","/challange4transferincomplete.html");
        }
            
    }

    function addComment(postData) {
        loggedInUsersData(function(loggedInData){
            if (postData.comment != null && postData.requestComments == null)
            {
                commentsList.push([loggedInData.username,postData.comment]);
                console.log("i was called " + JSON.stringify(commentsList));
                fileName = ROOT + "/challange5.html"
                fs.stat(fileName,handleStaticFile)
            } else if (postData.comment == null && postData.requestComments == "true")
            {   
                respondData = {
                    comments: commentsList
                }
                respondData = JSON.stringify(respondData);
                respond(200,respondData);
            }
        });
    }
    
    function respondToData(postData) {
        if (urlObj.pathname == "/login.html") {
            if (postData.requestUsers == "true") {
                sendBackUserList();
            } else if(postData.username && postData.password) {
                console.log(postData)
                checkLoginData(postData.username,postData.password);
            }
        }
        if (urlObj.pathname == "/home.html") {
            if (postData.requestUser == "true" && postData.requestCash == "true") {
                sendBackUserData();
            }
        }
        if (urlObj.pathname == "/challange4.html") {
            transferFunds(postData);
        }
        if (urlObj.pathname == "/challange5.html") {
            addComment(postData);
        }
    }

    function handlePostRequest() {
        var body = '';
        var post = '';
        req.on('data', function (data) {
            body += data;

            // DDOS FLAG
            
            if (body.length > 2000000)
                respond(200,"DDOS COMPLETE flag{d4ed72aa38d8df397a1de220681c4725}");
        });

        req.on('end', function () {
            post = qs.parse(body);
            respondToData(post);
        });
        
    }

    function challangeFourResponse(search_request) {
        var stmt = db.prepare("SELECT username FROM LoginData WHERE username = (?)");
        stmt.get(search_request,function(err,row) {
            if (err) {
                console.log("err")
                respondErr(err);
            } else if (row != undefined) {
                data = fs.readFileSync(ROOT+"/challange4search.html", "utf8")
                data = data.replace("(1)","<p> User: " + row.username + " </p> <br><br>")
                respond(200,data);
            } else {
                data = fs.readFileSync(ROOT+"/challange4search.html","utf8")
                data = data.replace("(1)","<p> "+search_request + " Doesn't Exist</p>")
                respond(200,data);
            }
        });
    }

    function challangeSevenResponse(search_param,search_request) {
        db.all("SELECT "+search_param+" FROM LoginData WHERE "+search_param+" = '" + search_request +"'", function(err, row){
            returnString = "";
            if (err) {
                console.log("err")
                respondErr(err);
            } else if (row[0] == undefined) {
                data = fs.readFileSync(ROOT+"/challange7search.html", "utf8")
                data = data.replace("(1)","<p> "+search_request + " Doesn't Exist</p>")
                respond(200,data);
            } else {
                for (i = 0 ; i < row.length ; i ++){
                    returnString += row[i][search_param];
                }
                data = fs.readFileSync(ROOT+"/challange7search.html","utf8")
                data = data.replace("(1)","<p> "+returnString + "</p>")
                respond(200,data);
            }

        });
    }
    
    function handleGetRequest(urlObj) {
        if (urlObj.pathname == "/" || urlObj.pathname == "/login.html") {
            fileName = ROOT+"/login.html";
            fs.stat(fileName, handleStaticFile);
        } else if (urlObj.pathname == "/resources/challange3") {
            filePath = path.join(__dirname,'/public/resources/challange3')
            stat = fs.statSync(filePath);
            console.log(stat.size);
            res.writeHead(200,{
                'Content-Type': '',
                'Content-Length': stat.size
            });

            readStream = fs.createReadStream(filePath);
            console.log(filePath);
            readStream.pipe(res);
            
        }  else if (urlObj.pathname == "/resources/challange6.c") {
            filePath = path.join(__dirname,'/public/resources/challange6.c')
            stat = fs.statSync(filePath);
            console.log(stat.size);
            res.writeHead(200,{
                'Content-Type': '',
                'Content-Length': stat.size
            });

            readStream = fs.createReadStream(filePath);
            console.log(filePath);
            readStream.pipe(res);
            
        }
        else  if (urlObj.query != null && urlObj.pathname == "/challange4.html") {
            try {
                if ( urlObj.query.split("=")[0] == "username"){
                    search_request = decodeURIComponent(urlObj.query.split(/=(.+)/)[1]);
                    challangeFourResponse(search_request);
                }
            } catch (err) {
                challangeFourResponse("");
            }
        } 
        else if (urlObj.query != null && urlObj.pathname == "/challange7.html") {
            try {
                    search_param = urlObj.query.split("=")[0] 
                    search_request = decodeURIComponent(urlObj.query.split(/=(.+)/)[1]);
                    challangeSevenResponse(search_param,search_request);
            } catch (err) {
                challangeSevenResponse("");
            }
        } 
        else {
            fs.stat(fileName,handleStaticFile);
        }
    }

	function respondErr(err)
	{
		console.log("Handle Error: "+ err.message);
		respond(500,err.message);
	}

    function respond (code,data,cookie, location, type) {
        res.writeHead(code, {'X-XSS-Protection':0, 'Set-Cookie': cookie || '','Location': location || "" , "content-type": type || mime.lookup(urlObj.pathname) || "text/html"});
        res.end(data || "");
    }
}
