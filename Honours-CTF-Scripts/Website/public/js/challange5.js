$(document).ready(function (){
    var commentsField = $("#comments");
    $.ajax({
        type: 'POST',
        data: {
            'requestComments' : 'true'
        },
        success: function(info) {
            data = JSON.parse(info);
            if (data.comments) {
                for (i = 0; i < data.comments.length ; i++) {
                    commentsField.append("<h5> User: "+ data.comments[i][0] + " </h5>");
                    commentsField.append("<p> Comment: "+ data.comments[i][1] + " </p>");
                    commentsField.append("<br><br>");
                }
            }
            
        },
        error: function(xhr,status,error) {
            console.log(xhr.responseText);
        }
    });
});