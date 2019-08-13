var OPTIONS = new Object()
        OPTIONS.Layout = new Object();
		OPTIONS.Layout.swMainProject_Width = 2;
		OPTIONS.Layout.swMainNav_Width = 2;
        OPTIONS.Layout.swMainOpt_Width = 2;
        OPTIONS.Layout.swMainEditor = true;
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
function addEntryEditor_1(idStr, h1Str, txtStr ){
    if (idStr == ""){
        Nel = $("#swContent").find(".swText_Feld").length;
        idStr = "swContent_"+Nel;
    }
    if (h1Str == ""){
        Nel = $("#swContent").find(".swText_Feld").length;
        h1Str = Nel + ". Ueberschrift";
    }

    $elTemp = $("#swContent_X").clone(true);
    $($elTemp).find(".swText_H1").text(h1Str);
    $($elTemp).find(".swText_Feld").text(txtStr);
    $($elTemp).css({"display":"block"});
    $($elTemp).attr("id", idStr);
    $("#swContent").append($elTemp);
    updateNavList();
}

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

$(".btnNav").click(function(){
    var idStr = $(this).attr("id");
    switch(idStr){
        case "swColProjClose":
            OPTIONS.Layout.swMainProject = false;
            updateMainColWidth();
            break;
        case "swColProjBig":
            if (OPTIONS.Layout.swMainProject_Width <4){
                OPTIONS.Layout.swMainProject_Width +=2
                $("#swColProjBig").text("<");
                }
                else{
                OPTIONS.Layout.swMainProject_Width = 2;
                $("#swColProjBig").text(">");
                }
                updateMainColWidth();
            break;
        case "swColNavClose":
            OPTIONS.Layout.swMainNav = false;
            updateMainColWidth();
            break;       
        case "swColNavBig":
            if (OPTIONS.Layout.swMainNav_Width <4){
                OPTIONS.Layout.swMainNav_Width +=2
                $("#swColNavBig").text("<");
                }
                else{
                OPTIONS.Layout.swMainNav_Width = 2;
                $("#swColNavBig").text(">");
                }
                updateMainColWidth();
            break;   
        case "swColOptClose":
            OPTIONS.Layout.swMainOpt = false;
            updateMainColWidth();    
            break;   
        case "swColOptBig":
            if (OPTIONS.Layout.swMainOpt_Width <4){
                OPTIONS.Layout.swMainOpt_Width +=2
                $("#swColOptBig").text(">");
                }
                else{
                OPTIONS.Layout.swMainOpt_Width = 2;
                $("#swColOptBig").text("<");
                }
                updateMainColWidth();
                break; 
        case "btnNewText":
            addEntryEditor_1([],[],[]);    
            break;                 
        default:
            logDebug(idStr+"[btnNav]: id not found");
            break
    }
});

//////////////////////////////////////////////////////////////////
$(".btnHideContent").click(function(){
    $(this).parent().find('.swText_Feld').toggle();
    if ($(this).parent().find('.swText_Feld').css('display')=='none')
    {
        $(this).parent().find('.btnHideContent').text('▼');
    } else {
        $(this).parent().find('.btnHideContent').text('▲');
    }
    logDebug("click")
});

$(".btnRemoveContent").click(function(){
    $(this).parent().remove();
    updateNavList();
    logDebug("click")
});


$( "#swNavList" ).sortable({
    start: function(e, ui) {
        OPTIONS.tmpDragPosStart = ui.item.index();
    },
    update: function(event,ui ) {
      OPTIONS.tmpDragPosEnd = ui.item.index();
      swContentReplace();
      
    }
});

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

//////////////////////////////////////////////////////////////////
//UPDATE NAVLIST WHEN H:EADING WAS LEFT
//////////////////////////////////////////////////////////////////
$(".swText_H1").focusout(function(){
    updateNavList();
})

$( "#swNavList" ).sortable({
    start: function(e, ui) {
        OPTIONS.tmpDragPosStart = ui.item.index();
    },
    update: function(event,ui ) {
      OPTIONS.tmpDragPosEnd = ui.item.index();
      swContentReplace();
      
    }
});
$( "#swNavList" ).disableSelection();

function swContentReplace(){
    ChEl = $("#swContent").find(".swContentBlock");
    pos1 = OPTIONS.tmpDragPosStart+1;
    pos2 = OPTIONS.tmpDragPosEnd+1;
    
    el1 = $(ChEl[pos1]).clone(true);
    el2 = $(ChEl[pos2]).clone(true);
    $(ChEl[pos1]).replaceWith(el2);
    $(ChEl[pos2]).replaceWith(el1);
    updateNavList();
};

// NAVLIST FUNCTIONS
function swNavTOF_click(e){

    //get position of element in DOM
    child = e;
    var i = 0;
    while( (child = child.previousSibling) != null ) {i++;}
    pos = i+1;
    chEl = $("#swContent").find(".swText_H1");
    var new_position = $(chEl[pos]).position().top - $(chEl[1]).position().top;
    $('#swMainEditor').stop().animate({ scrollTop: new_position }, 500);
}

// UPDATE NAVLIST
function updateNavList(){
    $("#swNavList").html("");
    var firstLoop = -1;
    $("#swContent").find(".swText_H1").each(function(){
        var $curEl = $(this);
        firstLoop += 1;
        if (firstLoop >0){
            var str = '<li id="swNavTOF_'+firstLoop+'" class="ui-state-default swNavTofRow" onclick="swNavTOF_click(this)">'+$curEl.text()+'</li>';
            $("#swNavList").html($("#swNavList").html() + str);
        }
    })
    logDebug("updateNavList");
}

//////////////////////////////////////////////////////////////////
// UPDATE MAIN WINDOW /////////////////////////////////
//////////////////////////////////////////////////////////////////
		function updateMainColWidth(){
           

			if (OPTIONS.Layout.swMainOpt == false){
                colOpt = 0;
                $("#swMainOptions").hide();
            } else{
                colOpt = OPTIONS.Layout.swMainOpt_Width;
                $("#swMainOptions").show();
            }

			if (OPTIONS.Layout.swMainProject == false){
                colProj = 0;
                $("#swMainProject").hide();
            }else {
                colProj = OPTIONS.Layout.swMainProject_Width;
                $("#swMainProject").show();
            }
				
			if (OPTIONS.Layout.swMainNav == false ){
                colNav = 0;
                $("#swMainNav").hide();
            }else {
                colNav = OPTIONS.Layout.swMainNav_Width;
                $("#swMainNav").show();
            }

            if (OPTIONS.Layout.MenuFont.enabled == false ){
                $("#swMenuFont").hide();
            }else {
                $("#swMenuFont").show();
            }
				
			//now remove class and set new
			$("#swMainProject").removeClass($("#swMainProject").attr('class'));
			$("#swMainProject").addClass("col-sm-"+colProj);

			$("#swMainNav").removeClass($("#swMainNav").attr('class'));
			$("#swMainNav").addClass("col-sm-"+colNav);

			$("#swMainOptions").removeClass($("#swMainOptions").attr('class'));
			$("#swMainOptions").addClass("col-sm-"+colOpt);

			var colW = 12-(colOpt+colNav+colProj);
			$("#swMainEditor").removeClass($("#swMainEditor").attr('class'));
			$("#swMainEditor").addClass("scrollableCol col-sm-"+colW);
        }
        
        function updateCSS(){
            $("body").css({"background-color":OPTIONS.Layout.CSS.bodyBG});
            $("body").css({"color":OPTIONS.Layout.CSS.bodyColor});
 
            $(".btnNav").css({"background-color":OPTIONS.Layout.CSS.btnNavBG});
            $(".btnNav").css({"border-color":OPTIONS.Layout.CSS.btnNavBorderColor});

            $("#swStatusFeld").css({"background-color":OPTIONS.Layout.CSS.swStatusFeldBG});

            $(".swMain_H1").css({"color":OPTIONS.Layout.CSS.swMain_H1_color});
            $(".swMain_H2").css({"color":OPTIONS.Layout.CSS.swMain_H1_color});

            $("body").css({"font-family":OPTIONS.Layout.CSS.mainFont});

        }