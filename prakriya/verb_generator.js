//"use strict";
// write small plugin for keypress enter detection
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == "13") {
                fnc.call(this, e);
            }
        });
    });
};

function createPanel(heading, row, id, outputTrans) {
    var cardClass = id % 2 ? "bg-secondary" : "bg-primary";
    var expanded = id === 0 ? "show" : "";
    var h = "<div class=\"card\"><div class=\"card-header " + cardClass + "\">";
    h += "<a class=\"text-white\" data-toggle=\"collapse\" href=\"#collapse" + id + "\" aria-expanded=\"false\" aria-controls=\"collapse" + id + "\">";
    h += heading + "</a></div>";
    h += "<div id=\"collapse" + id + "\" class=\"collapse " + expanded + "\"><div class=\"card-block\">";
    h += "<table class=\"table table-striped\">";
    h += "<thead><th scope=\"col\">Sutra</th><th scope=\"col\">Effect</th></thead><tbody>";
    row.forEach(function (entry) {
        var item = entry.map(function (e) {
            var temp = e.replace("!","~");
            console.log(e);console.log(temp);
            return temp;
        });
        h += "<tr><td>";
        h += item[0] + " (" + item[1] + ")</td>";
        h += "<td>" + item[2] + "</td></tr>";
    });
    h += "</tbody></table>";
    h += "</div></div></div>";
    return h;
}

$(document).ready(function () {
    $("#goButton").on("click", function () {
        var inputTrans = $("#inputTrans").val();
        var urlbase = $.query.get("api_url_base") !== "" ? $.query.get("api_url_base")
            : "https://api.sanskritworld.in/v0.0.2/verbforms/" + inputTrans + '/';
        var btn = $(this);
        var btxt = btn.text();
        btn.removeClass("btn-primary").addClass("btn-secondary");
        btn.text("Loading ...");
        $("#issueButton").addClass("d-none");
        var inputText = $("#inputText").val();
        var txt = inputText;
        var outputTrans = $("#outputTrans").val();
        var url = urlbase + txt + "/prakriya/machine?output_transliteration=" + outputTrans;
        console.log(url);
        $.getJSON(url, function (result) {
            var s = JSON.stringify(result);
            $("#devinp").text(inputText);
            $("#jsonbox").text(s);
            $("#restable").html("");
            //console.log(result);
            var restable = "";
            if (Array.isArray(result)) {
                restable += "<strong>Found " + result.length + " prakriyas</strong>";
                restable += "<br>Please click on a prakriya below to expand/collapse";
                $("#reshead").text("Prakriyaa");
                var panelID = 0;
                result.forEach(function (res) {
                    restable += createPanel("Prakriyaa " + (panelID + 1), res, panelID, outputTrans);
                    panelID += 1;
                });
            } else if (result.hasOwnProperty("error")) {
                $("#reshead").text("Error");
                restable += result.error;
            }
            $("#restable").append(restable);
            $("#jsonButton").removeClass("d-none");
            $("#devtab").removeClass("d-none");
            $("#restab").removeClass("d-none");
            btn.removeClass("btn-secondary").addClass("btn-primary");
            btn.text(btxt);
        });
    });

    // use custom plugin
    $("#inputText").enterKey(function () {
        $("#goButton").click();
    });

});
