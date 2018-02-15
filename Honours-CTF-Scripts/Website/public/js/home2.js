$(document).ready(function (){
    var title = $("#title");
    var cash = $("#cash");
    $.ajax({
        type: 'POST',
        data: {
            'requestUser' : 'true',
            'requestCash' : 'true'
        },
        success: function(info) {
            data = JSON.parse(info);
            if (data.cash) {
                cashText = cash.text();
                cashText = cashText.replace("CASH", data.cash);
                cash.text(cashText);
            }
            if (data.user) {
                titleText = title.text();
                titleText = titleText.replace("USER", data.user);
                title.text(titleText);
            }
            
        },
        error: function(xhr,status,error) {
            console.log(xhr.responseText);
        }
    });
});