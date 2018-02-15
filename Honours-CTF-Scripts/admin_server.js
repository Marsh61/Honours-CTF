var net = require("net");
var webdriver = require('selenium-webdriver');


function handleRequest(socket)
{
    
    
    socket.on('data',function(chunk) {

        try {
            var response = chunk;
            response = String(response);
            if (response.startsWith("http://")) {
                driver.manage().addCookie({
                    name: '',
                    value: '5364f0c3554b0f6c88fc13b977f94f3f',
                    domain: '',
                    path: '/',
                    secure: false
                });
                response = String(response);
                
                console.log(response)
                driver.get(response);
                
                driver.get(response);

            }
        } catch(err) {
            console.log(err)
        }
        

    })

}



var options = {
      'args': ['--disable-web-security', '--user-data-dir=~/.e2e-chrome-profile']
    }
var chromeCapabilities = webdriver.Capabilities.chrome();

chromeCapabilities.set('chromeOptions', options)
var driver = new webdriver.Builder().withCapabilities(chromeCapabilities)
    .build();
driver.get("http://localhost:3003/login.html");


function refresh(){
    driver.manage().addCookie({
        name: '',
        value: '59fb161a17ea439cacff76707bbe25cf',
        domain: '',
        path: '/',
        secure: false
    });
    driver.get("http://localhost:3003/challange5.html")
}

setInterval(refresh, 9000)


var server = net.createServer(function(socket) {
    socket.write("Hello, This is monopoly Guy and I have more money than you!\r\n");


    socket.setEncoding('utf8');
    handleRequest(socket);
})

server.listen(3004,'localhost');