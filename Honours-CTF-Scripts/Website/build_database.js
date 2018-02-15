var fs = require("fs");
var hat = require('hat').rack();

var usernames = fs.readFileSync("./usernames.txt","utf8");
var passwords = fs.readFileSync("./passwords.txt","utf8");
var top26pass = fs.readFileSync("./top26passwords.txt","utf8");
usernames = usernames.replace(/'/g,"");
passwords = passwords.replace(/'/g,"");
top26pass = top26pass.replace(/'/g,"");
usernames = usernames.split("\n");
passwords = passwords.split("\n");
top26pass = top26pass.split("\n");

var options = {
    encoding: 'utf8',
    mode: 0o666,
    flag: 'w'};
const numberOfUsers = 12349;
var adminID = hat();
string = "insert into LoginData (ID,username,password,cash) values ('"+adminID+"','Admin','YOUWILLNEVERGUESSTHISPASSWORD',0);\n";
fs.writeFileSync("LoginData.sql",string,options);
var options = {
    encoding: 'utf8',
    mode: 0o666,
    flag: 'a'};
var monopolyGuyID = hat();
string = "insert into LoginData (ID,username,password,cash) values ('"+monopolyGuyID+"','monopolyGuy','MONOPLYMAN1029128',10000);\n";
fs.writeFileSync("LoginData.sql",string,options);



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


    for (i = 0 ; i < numberOfUsers ; i++) {
        console.log(i);
        randomUsername = getRandomInt(0,usernames.length);
        randomPassword = getRandomInt(0,passwords.length);
        random26Password = getRandomInt(0,top26pass.length);
        randomCash = getRandomInt(1,200);
        userID = hat();
        if (getRandomInt(0,9) < 2) {
            string = "INSERT INTO LoginData (ID,username,password,cash) VALUES ('"+userID+"','"+usernames[randomUsername]+"','"+top26pass[random26Password]+"',"+randomCash+");\n";  
            fs.writeFileSync("LoginData.sql",string,options);  
        } else {
            string = "INSERT INTO LoginData (ID,username,password,cash) VALUES ('"+userID+"','"+usernames[randomUsername]+"','"+passwords[randomPassword]+"',"+randomCash+");\n"; 
            fs.writeFileSync("LoginData.sql",string,options);
        }
    }