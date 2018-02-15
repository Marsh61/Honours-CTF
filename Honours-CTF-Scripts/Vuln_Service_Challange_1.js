var net = require("net")

//flag{8f6c152998a8a40788de2832dd2c6738}

function handleRequest(socket)
{
    socket.write("Welcome to my calculator server\r\n");
    socket.write("only does simple operations /, +, -, *\r\n")
    socket.write("Eg: 2+2 will return your result of 4\r\n")
    
    socket.on('data',function(chunk) {

        try {
            var response = eval(chunk);
            socket.write("the result of your calcualtion is\r\n"+ response + " \r\n");
        } catch(err) {
            socket.write("if you're looking for a flag I swear its not in the source")
        }
        

    })

}

var server = net.createServer(function(socket) {
    socket.setEncoding('utf8');
    handleRequest(socket);
})






server.listen(3000,'localhost');