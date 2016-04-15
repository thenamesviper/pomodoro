$(document).ready(startUp);

let $onBreak = false;
let $totalLength, $currentLength; //length of bars to show countdown progress in #timer
let $backgroundColor = "red";

function startUp() {
    $totalLength = parseInt($("#timer").html())*60;
    $currentLength = parseInt($("#timer").html())*60;
    allowTimerChange();
    setupTimer();
}

function allowTimerChange() {
    $(".subtract, .add").removeClass("disabled");
    
    $(".subtract").on("click", function() {
        $(this).parent().find(".add").removeClass("disabled");
        let $newValue = parseInt($(this).parent().find("p").html()) - 1;
        if ($newValue > 0) {
            $(this).parent().find("p").html($newValue);
        } 
        if($newValue == 1){
            $(this).addClass("disabled");
        }
    });
    $(".add").on("click", function() {
        $(this).parent().find(".subtract").removeClass("disabled");
        let $newValue = parseInt($(this).parent().find("p").html()) + 1;
        if ($newValue <= 60) {
            $(this).parent().find("p").html($newValue);
        }
        if($newValue == 60){
            $(this).addClass("disabled");
        }
    });
   $("#reset").on("click", function() {
       $("#timer").html($("#session-length").html().toString() + ":00");
       $totalLength = parseInt($("#timer").html())*60;
       $currentLength = parseInt($("#timer").html())*60;
       $backgroundColor = "red";
       $("#timer").css("background", "linear-gradient(90deg, red 100%, dimgray 0%)");
       $onBreak = false;
   })
}

function disableTimerChange() {
    $(".subtract, .add, #reset").off("click");
    $(".subtract, .add").addClass("disabled");
}

function setupTimer() {
    $(".glyphicon-play").on("click", function() {
        disableAndEnableOther("play");
        disableTimerChange();
       
        let timerInterval = setInterval(function() {
            $currentLength --;
            changeClock($onBreak);
            changeFillAmount();
        }, 1000);
       $(".glyphicon-pause").on('click', function() {
                allowTimerChange();
                clearInterval(timerInterval);
                $("#infoText").html("PAUSED");
                $("#infoText").css("color", "black");
                disableAndEnableOther("pause");
            });
    })
}

//gets rid of unwanted behavior from multiple clicks
function disableAndEnableOther(selector){
    if(selector == "play") {
        $(".glyphicon-play").off("click");
    } else {
        $(".glyphicon-pause").off("click");
        setupTimer();
    }
}

function changeClock() {
     if(!$onBreak){
            $("#infoText").html("WORK");
            $("#infoText").css("color", "red")
        } else {
            $("#infoText").html("BREAK");
            $("#infoText").css("color", "green");
        }
    
    $time = $("#timer").html();
    //attention paid to possible single digit minute
    let $minutes = $time.length == 5 ? $time.substring(0, 2) : $time.substring(0, 1);
    let $seconds = $time.length == 5 ? $time.substring(3, 5) : $time.substring(2, 4);
    
    if ($seconds > 0) {
        $seconds--;
        if ($seconds.toString().length == 1) {
            $seconds = ("0" + $seconds).toString();
        }
        $("#timer").html($minutes + ":" + $seconds);
    } else if($minutes > 0) {
        $minutes--;
        $seconds = "59";
        $("#timer").html($minutes + ":" + $seconds);
    } else {
       changeTimer()
    }
}

//handles changing between break and session
//array refers to what is being changed TO
function changeTimer() {
    let working = $onBreak ? ["#session-length", "red", "WORK"] : ["#break-length", "green", "BREAK"];
    $("#infoText").html(working[2]);
    $("#timer").html( $(working[0]).html().toString() + ":00");
    $currentLength = parseInt($(working[0]).html())*60;
    $totalLength = parseInt($(working[0]).html())*60;
    $backgroundColor = working[1];
   
    $onBreak = !$onBreak;
}

//starts full w/ red 100%, dimgray 0%
function changeFillAmount() {
    let fillString = (Math.round($currentLength / $totalLength * 100).toString()) + "%";
    $("#timer").css("background", "linear-gradient(90deg, " + $backgroundColor + ", " + fillString + ",dimgray 5%");
}
