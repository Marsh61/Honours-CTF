var net = require("net")


//potential solution: aaaaaaaaaaaaFlAg 
function handleRequest(socket)
{
    socket.write("Please Input Text Here:\n");

    socket.on('data',function(chunk) {
        try {
            var response = String(chunk);
            if (response.endsWith("FlAg\n") && response.length == 17) {
                socket.write("flag{14c74a17407e40974de7fb70f8930e8b}")
            }
            else {
                socket.write("Incorrect\n")
            }
        } catch(err) {
            socket.write("")
        }
        

    })

}

var server = net.createServer(function(socket) {
    socket.setEncoding('utf8');
    handleRequest(socket);
})






server.listen(8000,'localhost');