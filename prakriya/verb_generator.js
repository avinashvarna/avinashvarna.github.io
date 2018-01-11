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
    var links = ["madhaviya", "dhatupradipa", "kshiratarangini", "uohyd"];
    links.forEach(function (prop) {
        h += "<tr><td>" + prop + "</td>";
        h += "<td><a href=" + result[prop] + " target=\"_blank\" rel=\"noopener noreferrer\">Link</a></td>";
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
    heading += "(" + result.gana;
    if (result.it_status !== "") {
        heading += " " + result.it_status;
    }
    heading += ") - ";
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
    result.prakriya.forEach(function (item) {
        h += "<tr><td>";
        h += item.sutra;
        if (item.sutra_num.includes(".")) {
            h += " (<a href=\"http://www.ashtadhyayi.com/sutraani/" + item.sutra_num.replace(/\./g, "/") + "\"";
            h += " target=\"_blank\" rel=\"noopener noreferrer\">";
            h += item.sutra_num + "</a>)";
        }
        h += "</td>";
        h += "<td>" + item.form + "</td></tr>";
    });
    h += "</tbody></table>";

    h += createSubPanel(result, id);
    h += "</div>"; // collapse
    h += "</div>"; //card
    return h;
}

function getPrakriya(inputTrans, inputText, outputTrans) {
    var urlbase = $.query.get("api_url_base") !== "" ? $.query.get("api_url_base") :
            "https://api.sanskritworld.in/v0.0.2/verbforms/" + inputTrans + "/";
    var url = urlbase + inputText + "?output_transliteration=" + outputTrans;
    
    var btn = $("#goButton");
    btn.removeClass("btn-primary").addClass("btn-secondary");
    btn.text("Loading ...");
    $("#devinp").text(inputText);
    $("#jsonbox").text("");
    $("#jsonButton").addClass("d-none");
    $("#linktab").addClass("d-none");
    $("#restab").addClass("d-none");
    $("#restable").html("");
    $.getJSON(url, function (result) {
        var s = JSON.stringify(result);
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
        
        var link = $.query.set("input_trans", inputTrans).set("input", inputText).set("output_trans", outputTrans);
        $("#linkp").text(location.pathname + link.toString());
        $("#linktab").removeClass("d-none");
    })
    .fail(function () {
        var msg = "An error occured.";
        msg += "This may be caused by the input form not being present in the database. Please report any issues <a href=\"https://github.com/drdhaval2785/prakriya/issues\"  target=\"_blank\" rel=\"noopener noreferrer\">here</a>.";
        $("#restable").html(msg);
    })
    .always(function () {
        btn.removeClass("btn-secondary").addClass("btn-primary");
        btn.text("Go");
        $("#devtab").removeClass("d-none");
        $("#restab").removeClass("d-none");
    });
}
    
$(document).ready(function () {
    "use strict";
    $("#goButton").on("click", function () {
        var inputTrans = $("#inputTrans").val();
        var inputText = $("#inputText").val();
        var outputTrans = $("#outputTrans").val();
        getPrakriya(inputTrans, inputText, outputTrans);
        
    });

    // use custom plugin
    $("#inputText").enterKey(function () {
        $("#goButton").click();
    });
    
    var inputTrans = $.query.get("input_trans");
    var inputText = $.query.get("input");
    var outputTrans = $.query.get("output_trans");
    if(inputTrans !== "" && inputText !== "" && outputTrans !== "") {
        $("#inputTrans").val(inputTrans);
        $("#inputText").val(inputText);
        $("#outputTrans").val(outputTrans);
        getPrakriya(inputTrans, inputText, outputTrans);
    }

});
