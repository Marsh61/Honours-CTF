var net = require("net")

//flag{45153dc5dfc5d028cc05261f2047c9b5}

function handleRequest(socket) {
    socket.write("Welcome to my calculator server\r\n");
    socket.write("only does simple operations /, +, -, *\r\n")
    socket.write("Eg: 2+2 will return your result of 4\r\n")
    
    socket.write("Note: due to hackers I added filtering\r\n");

    socket.on('data', function (chunk) {

        if(new RegExp(/[\[\]\.\\]/).test(chunk)){
            socket.write("haha think I will be fooled that easily? \r\n");
            socket.write("No more function calls as I removed the following [\[\]\.\\] \r\n");
            return;
        }

        try {
            var response = eval(chunk);
            socket.write("the result of your calcualtion is\r\n"+ response + " \r\n");
        } catch(err) {
            socket.write("if you're looking for a flag I swear its not in the source")
        }
    })

}

var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    handleRequest(socket);
})






server.listen(2999, 'localhost');

//with (require('fs')) { readFileSync(__filename)}