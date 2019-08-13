
var DATA;

function initManager(){
    DATA = new Object();
    DATA["trash"] = [];

}


$(".swProjectRow").click(function(){
    logDebug("Click:swProjects"+$(this).attr("id"))
})

$(".swProjectRow").on("dblclick", function(){
    logDebug("dbl:swProjects"+$(this).attr("id"))
})

$("#swProjNew").click(function(){
    logDebug("btn:"+$(this).attr("id"))
})

