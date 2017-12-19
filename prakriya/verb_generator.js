// write small plugin for keypress enter detection
$.fn.enterKey = function (fnc) {
    "use strict";
    return this.each(function () {
        $(this).keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode === 13) {
                fnc.call(this, e);
            }
        });
    });
};

function createSubPanel(result, id) {
    "use strict";
    var h = "<div class=\"card\">";
    h += "<div class=\"card-header\">";
    h += "<a class=\"\" data-toggle=\"collapse\" href=\"#collapseSub" + id + "\" aria-expanded=\"false\" aria-controls=\"collapseSub" + id + "\">";
    h += "Additional Information</a></div>"; //card-header
    h += "<div id=\"collapseSub" + id + "\" class=\"collapse \">";
    h += "<div class=\"card-body\">(Some links may not work for certain forms)</div>";
    h += "<table class=\"table table-striped\"><tbody>";
    var links = ["madhaviya", "dhatupradipa", "kshiratarangini", "jnu", "uohyd"];
    links.forEach(function (prop) {
        h += "<tr><td>" + prop + "</td>";
        h += "<td><a href=" + result[prop] + ">Link</a></td>";
    });
    h += "</tbody></table>";
    h += "</div>"; // collapse
    h += "</div>"; //card
    return h;
}

function createPanel(result, id) {
    "use strict";
    var cardClass = id % 2 ? "bg-secondary" : "bg-primary";
    var expanded = id === 0 ? "show" : "";
    var heading = "";
    heading = result.verb + " " + result.meaning + " ";
    heading += "(" + result.gana + " " + result.it_status + ") - ";
    heading += result.lakara + " ";
    heading += result.purusha + ". " + result.vachana + ". ";

    var h = "<div class=\"card\">";
    h += "<div class=\"card-header " + cardClass + "\">";
    h += "<a class=\"text-white\" data-toggle=\"collapse\" href=\"#collapse" + id;
    h += "\" aria-expanded=\"false\" aria-controls=\"collapse" + id + "\">";
    h += heading + "</a></div>"; //card-header
    h += "<div id=\"collapse" + id + "\" class=\"collapse " + expanded + "\">";
    h += "<table class=\"table table-striped\">";
    h += "<thead><th scope=\"col\">Sutra</th><th scope=\"col\">Effect</th></thead><tbody>";
    result.derivation.forEach(function (item) {
        h += "<tr><td>";
        h += item.sutra + " (" + item.sutra_num + ")</td>";
        h += "<td>" + item.form + "</td></tr>";
    });
    h += "</tbody></table>";

    h += createSubPanel(result, id);
    h += "</div>"; // collapse
    h += "</div>"; //card
    return h;
}

$(document).ready(function () {
    "use strict";
    $("#goButton").on("click", function () {
        var inputTrans = $("#inputTrans").val();
        var urlbase = $.query.get("api_url_base") !== "" ? $.query.get("api_url_base")
            : "https://api.sanskritworld.in/v0.0.2/verbforms/" + inputTrans + "/";
        var btn = $(this);
        var btxt = btn.text();
        btn.removeClass("btn-primary").addClass("btn-secondary");
        btn.text("Loading ...");
        $("#issueButton").addClass("d-none");
        var inputText = $("#inputText").val();
        var outputTrans = $("#outputTrans").val();
        var url = urlbase + inputText + "?output_transliteration=" + outputTrans;
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
                    restable += createPanel(res, panelID);
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
