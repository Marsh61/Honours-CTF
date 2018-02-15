#!/bin/bash
set -m
# change your home paths so they match up with your directory
cd "/home/vulnserver/Documents/Honours Project/Website"
node ./App.js &
cd "/home/vulnserver/Documents/Honours Project"
node ./Vuln_Service_Challange_2.js &
node ./Vuln_Service_Challange_1.js &
node ./admin_server.js &
node ./overflow_challange.js &