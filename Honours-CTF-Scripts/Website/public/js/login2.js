$(document).ready(function (){
    $.ajax({
        type: 'POST',
        data: {
            'requestUsers' : 'true'
        },
        success: function(list) {
            console.log(list);
            list = JSON.parse(list);
            length = list.length;
            for (var i = 0 ; i < length ; i++) {
                var li = $("<li>" + list[i] + "</li>");
                $("#supporting-members-list").append(li);
            }
        },
        error: function(xhr,status,error) {
            console.log(xhr.responseText);
        }
    });
});