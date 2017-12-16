//"use strict";
// write small plugin for keypress enter detection
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                fnc.call(this, e);
            }
        })
    })
}

// use custom plugin
$(document).enterKey(function () {
    $("#goButton").click();
});

function createPanel(heading, row, id, outputTrans) {
    var cardClass = id % 2
        ? "bg-secondary"
        : "bg-primary";
    var expanded = id == 0 
        ? "show" 
        : "";
    var h = "<div class=\"card\"><div class=\"card-header " + cardClass + "\">";
    h += "<a class=\"text-white\" data-toggle=\"collapse\" href=\"#collapse" + id + "\" aria-expanded=\"false\" aria-controls=\"collapse" + id + "\">";
    h += heading + "</a></div>";
    h += "<div id=\"collapse" + id + "\" class=\"collapse " + expanded + "\"><div class=\"card-block\">";
    h += "<table class=\"table table-striped\">";
    h += "<thead><th scope=\"col\">Sutra</th><th scope=\"col\">Effect</th></thead><tbody>";
    row.forEach(function (entry) {
        var item = entry.map(function (e) {return Sanscript.t(e, 'slp1', outputTrans)});
        h += "<tr><td>";
        if (entry[0] != "Final form") {
            h += item[0] + " (" + item[1] + ")</td>";
        } else {
            h += "Final form";
        }
        h += "<td>" + item[2] + "</td></tr>";
    });
    h += "</tbody></table>";
    h += "</div></div></div>";
    return h;
}

$(document).ready( function () {
    $("#goButton").on("click", function () {
        var urlbase = $.query.get("api_url_base") !== ""? $.query.get("api_url_base") : "https://api.sanskritworld.in/v0.0.1/";
        var btn = $(this);
        var btxt = btn.text();
        btn.removeClass("btn-primary").addClass("btn-secondary");
        btn.text("Loading ...");
        $("#issueButton").addClass("d-none");
        var inputTrans = $("#inputTrans").val()
        var inputText = $("#inputText").val();
        if (inputTrans != "slp1") {
            console.log("Converting " + inputText + " from " + inputTrans + " to slp1");
            txt = Sanscript.t(inputText, inputTrans, "slp1");
            console.log(txt);
        } else {
            txt = inputText;
        }
        var outputTrans = $("#outputTrans").val()
        var url = urlbase + txt + "/prakriya/machine";
        $.getJSON(url, function(result){
            var s = JSON.stringify(result);
            $("#devinp").text(inputText);
            $("#jsonbox").text(s);
            $("#restable").html("");
            //console.log(result);
            if(Array.isArray(result)) {
                var restable = "<strong>Found " + result.length + " prakriyas</strong>"
                restable += "<br>Please click on a prakriya below to expand/collapse";
                $("#reshead").text("Prakriyaa");
                var panelID = 0;
                result.forEach( function(res) {
                    restable += createPanel("Prakriyaa " + (panelID +1), res, panelID, outputTrans);
                    panelID += 1;
                });
            } else if("error" in result) {
                $("#reshead").text("Error");
                var restable = result.error;
            }
            $("#restable").append(restable);
            $("#jsonButton").removeClass("d-none");
            $("#devtab").removeClass("d-none");
            $("#restab").removeClass("d-none");
            btn.removeClass("btn-secondary").addClass("btn-primary")
            btn.text(btxt)
        });
    });


});

