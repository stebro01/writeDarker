var OPTIONS = new Object()
    OPTIONS.Layout = new Object();
    OPTIONS.Layout.swMainProject_Width = 2;
    OPTIONS.Layout.swMainNav_Width = 2;
    OPTIONS.Layout.swMainOpt_Width = 2;
    OPTIONS.Layout.swMainEditor_2_Width = 2;
    OPTIONS.Layout.swMainEditor_1 = true;
    OPTIONS.Layout.swMainEditor_2 = true;
    OPTIONS.Layout.swMainEditor_ACTIVE = 1;
    OPTIONS.Layout.swMainProject = true;
    OPTIONS.Layout.swMainNav = true;
    OPTIONS.Layout.swMainOpt = true;
    OPTIONS.Layout.MenuFont = new Object();
    OPTIONS.Layout.MenuFont.enabled = false;
    OPTIONS.Layout.MenuFont.toggle = true;
    OPTIONS.Layout.MenuFont.SoundEnabled = false;
    OPTIONS.Layout.MenuFont.disabledOpacity = 0.5;
    OPTIONS.Layout.MenuFont.KIEnabled = false;
    OPTIONS.Layout.MenuFont.ZenEnabled = false;

    OPTIONS.Layout.CSS = new Object();
    OPTIONS.Layout.CSS.bodyBG = "#222427";
    OPTIONS.Layout.CSS.bodyColor = "lightslategray";
    OPTIONS.Layout.CSS.btnNavBG = "#222427";
    OPTIONS.Layout.CSS.btnNavBorderColor = "#353738";
    OPTIONS.Layout.CSS.swStatusFeldBG = "black";
    OPTIONS.Layout.CSS.swMain_H1_color= "white";
    OPTIONS.Layout.CSS.mainFont = "Trebuchet MS"; 

    OPTIONS.Debug = new Object()
    OPTIONS.Debug.enabled = true;
    OPTIONS.Debug.TextLength = 60;
    OPTIONS.Sound = new Object();
    OPTIONS.Sound.enabled = false;
    OPTIONS.Sound.TippUrl = 'media/tipp_sound.wav';
    OPTIONS.CodeView = false;

    OPTIONS.Store_LocalName = "wd_STORAGE";
    OPTIONS.tmpDragPosStart = [];
    OPTIONS.tmpDragPosEnd = [];
        
        
        function logStatus(strText){
                $("#swStatusFeld").text(strText);

        }
        function logDebug(strText){
            if (OPTIONS.Debug.enabled){
                var TXT = $("#swStatusFeld").text();
                TXT = TXT+ "; " + strText;
                if (TXT.length > OPTIONS.Debug.TextLength,TXT)
                    TXT = TXT.substring(TXT.length - OPTIONS.Debug.TextLength,TXT.length);
                $("#swStatusFeld").text(TXT);
            }
        }

        function logInfo(strText){
            $("#swBottomNavTxt").text(strText);
        }

//DATA STORAGE LOCALLY
$(".btnStore").click(function(){
    var idStr = $(this).attr("id");
    switch(idStr){
        case "btnProjStore":
                logDebug("storeLocally");

                // check for previously stored data
                var oldDataFound = false;
                for (i=0; i<window.localStorage.length; i++){
                    if (window.localStorage.key(i) == OPTIONS.Store_LocalName)
                        oldDataFound = true;
                }

                if (oldDataFound){
                    $('#swModalSave').modal('show');
                } else{
                    storeLocal();
                }
            break
        case "btnProjLoad":
                logDebug("loadLocally");
                loadLocal();
            break
        default:
            logDebug(idStr+": id not found");
            break
    }
});

function loadLocal(){
    wd_STORAGE = JSON.parse(window.localStorage.getItem(OPTIONS.Store_LocalName));

    // restore the option
    OPTIONS = wd_STORAGE.OPTIONS;
    updateMainColWidth();

    // restore content
    content = wd_STORAGE.content;

    // first empty the editor and then fill it again
    emptyEditor_1();
    for (i=0; i<content.length; i++){
        addEntryEditor_1(content[i].ID, content[i].H1, content[i].TXT);
    }
    logInfo(OPTIONS.Store_LocalName+ " geladen, " + content.length + " Einträge [timestamp: " + wd_STORAGE.lastSync+"]");
}

function storeLocal(){
    var content = new Array();
    $content = $("#swMainEditor").find(".swContentBlock");
    
    for (i = 1; i<$content.length; i++){
        var data = new Object();
        data.H1 = $($content[i]).find(".swText_H1").text();
        data.TXT = $($content[i]).find(".swText_Feld").text();
        data.ID = $($content[i]).attr("id");
        content.push(data);
    }

    var wd_STORAGE = new Object();
    wd_STORAGE.content = content;
    wd_STORAGE.OPTIONS = OPTIONS;
    wd_STORAGE.lastSync = new Date();

    window.localStorage.setItem(OPTIONS.Store_LocalName, JSON.stringify(wd_STORAGE));
    logInfo(" lokal gespeichert in "+OPTIONS.Store_LocalName);
}

// WORKING WITH THE EDITOR WINDOW////////
// addEntryEditor_1(idStr, h1Str, txtStr ) -> ADD AN ENTRY (i.e. addEntryEditor_1([],[],[]))
// 2) emptyEditor_1() -> REMOVE ALL ENTRIES

function emptyEditor_1(){
    // clone the first element and empty the content
    $elTemp = $("#swContent_X").clone(true);
    $("#swContent").empty();
    $("#swContent").append($elTemp);
    // now add the first element again
}


//////////////////////////////////////////////////////////////////
// BUTTONS
//////////////////////////////////////////////////////////////////
$(".btnMain").click(function(){
    var idStr = $(this).attr("id");
    switch(idStr){
        case "btnMenuWindows":
            if ($("#swMainProject").css('display') == 'none'){
                OPTIONS.Layout.swMainProject = true;
                OPTIONS.Layout.swMainNav= true;
            }
            else{
                OPTIONS.Layout.swMainProject = false;
                OPTIONS.Layout.swMainNav= false;
            }
            updateMainColWidth();
            break
        case "btnMenuOptions":
            if ($("#swMainOptions").css('display') == 'none'){
                OPTIONS.Layout.swMainOpt = true;
            }
            else{
                OPTIONS.Layout.swMainOpt = false;
            }
            updateMainColWidth();
            break
        case "btnMenuWords":
            if ($("#swMenuFont").css('display') == 'none'){
                OPTIONS.Layout.MenuFont.enabled = true;
            }
            else{
                OPTIONS.Layout.MenuFont.enabled = false;
            }
            updateMainColWidth();
            break;
        default:
            logDebug(idStr+"[btnMain]: id not found");
            break
    }
})

//////////////////////////////////////////////////////////////////
//PRJECT LIST
//////////////////////////////////////////////////////////////////
$( "#swProjects" ).disableSelection();
$( "#swProjects" ).sortable({
    start: function(e, ui) {
        logDebug(ui.item.index());
    },
    update: function(event,ui ) {
        logDebug(ui.item.index())
      
    }
});






        
    