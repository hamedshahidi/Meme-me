(function() {
    $("button").click(function() {
        $("span").html(function(i, val) {
            return val * 1 + 1;
        });
    });

}).call(this);


function myFunction() {
    document.getElementsByClassName("like").innerHTML = "Hello World";
}