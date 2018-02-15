WELCOME TO HONOURS-CTF
-----------------------

START THE CTF
--------------------------------------------
Execute the Start_CTF.sh script to start the CTF


SERVICES
--------------------------------------------

	The website is hosted on port 3003 (browser)

	PWN challenge level 1 is hosted port 3000 (netcat into it)

	PWN challenge level 2 is hosted on port 2999 (netcat into it)

	Talk to Monopoly Guy on port 3004 (netcat into it)

	Buffer overflow challenge is on port 8000 (netcat into it)

FLAGS
---------------------------------------------

	PWN Challenge level 1 = flag{8f6c152998a8a40788de2832dd2c6738}

	PWN Challenge level 2 = flag{45153dc5dfc5d028cc05261f2047c9b5}

	WEB Login Challenge 1 = flag{46c9b166037de85e41b0fcb8ff1b1d26}

	WEB DDOS Challenge 2= flag{d4ed72aa38d8df397a1de220681c4725}

	Compiled File Retrieve Password Challenge 3 = flag{fc1fbb4dbbc85c2e83645f1bb455bbc2}

	WEB REFLECTIVE XSS Challenge 4 = flag{96dd98d386702b0d1c9454889986fc02}

	WEB STORED XSS Challenge 5 = flag{aec9f7f4609633dceb7af058e8c326c2}

	Buffer Overflow Challenge 6 = flag{14c74a17407e40974de7fb70f8930e8b}

	WEB SQL Injection Challenge 7 = flag{5c247282f12ce7f8768f91a4531d8cc1}

BONUS
---------------------------------------------
	
	Log into the user account "privescalation" password: "password" use a privilege escalation attack to read the contents of the flag file. 
	
	Privilege Escalation Challenge = flag{d2723b7a3b505daa32db0cdb7b30553c} 


TROUBLESHOOTING
---------------------------------------------

	Sometimes admin_server.js doens't start properly (a remote control chrome browser should come up and log into the website if that doens't happen an error should be displayed)  if this happens shut down the VM and try again. If you are unable to get this to run challenges 4 and 5 will not work properly. 

	If you supply a invalid address to Monopoly man on port 3004, this could crash the admin_server.js. resart the admin server by running "/home/vulnserver/Documents/Honours Project/admin_server.js". Know that monopoly man is running on the same host as the server, Thus use localhost:3003 instead of <Machine IP>:3003  

	Sometimes chrome will fail to load the usernames for web challenge 1 (login challenge) 
using firefox should fix this issue.

	When compiling code for the buffer overflow challenge use the gcc option -fno-stack-protector

