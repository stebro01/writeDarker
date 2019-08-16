///// SAMMLUNG ALLER INTERAKTIONEN IM MAIN WINDOW MIT DEM USER > PROJEKTMANAGER

//////////////////////////////////////////////////////////////////
////// 1) Neues Projekt
//////////////////////////////////////////////////////////////////
$("#swProjNew").click(function(){
    addProjectWithContent("Neues Projekt","neu", "neu",[]);
    loadGUI_Projects()
})

//////////////////////////////////////////////////////////////////
///// 2) EIN PROJEKT AUSWAEHLEN UND DANN IN DIE NAVBAR LADEN
//////////////////////////////////////////////////////////////////

function swNavSelectProject(e){
    logDebug("Click:swProjects"+$(e).attr("id"))
    let _creationID = $(e).attr("id");
    switch (_creationID){
        case "swProjTrash":
            logInfo("Trash ausgewaehlt");
            ACTIVE_PROJECT = DATA["trash"];
            loadGUI_Navigation();
            break
        case "swProjAll":
                $("#swNavList").html("kommt noch")
            break    

        default:
            logInfo(_creationID+" ausgewaehlt");
            ACTIVE_PROJECT = findProjectByID(_creationID);
            loadGUI_Navigation();
            break
    }
}

function loadGUI_Navigation(){
    $(".TEMPLATE").hide()
    var contentStr = ""
    for (i=0;i<ACTIVE_PROJECT.content.length;i++){
        contentStr += '<li id="'+ACTIVE_PROJECT.content[i].strID+'" class="swNavTofRow" onclick="swNavTOF_click(this)">'+ACTIVE_PROJECT.content[i].H1+'</li>';
    }
    $("#swNavList").html(contentStr);
    $("#swNavName").text(ACTIVE_PROJECT.title);
    loadGUI_Editor()
}

function loadGUI_Editor(){
    //welcher ist aktiv?
    activeEditor = getActiveEditor().find(".swContent");

    $(activeEditor).html("");

    for (i=0;i<ACTIVE_PROJECT.content.length;i++){
        
        elTemp = $("#swContent_X").clone(true);
        $(elTemp).find(".swText_H1").text(ACTIVE_PROJECT.content[i].H1);
        $(elTemp).find(".swText_Feld").html(ACTIVE_PROJECT.content[i].TXT);
        $(elTemp).removeClass("TEMPLATE");
        $(elTemp).css({"display":"block"});
        $(elTemp).attr("id", ACTIVE_PROJECT._creationID+"@"+ACTIVE_PROJECT.content[i].strID);
        $(activeEditor).append(elTemp);
    }

    getActiveEditor().find(".swMainEditorTitle").text(ACTIVE_PROJECT.title)
}

//////////////////////////////////////////////////////////////////
//3. UPDATE NAVLIST WHEN H:EADING WAS LEFT
//////////////////////////////////////////////////////////////////
// update the NAVLIST 
$(".swText_H1").focusout(function(){
    updateNavList();
})

// DRAG DROP
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

// CLICK ON NAV ELEMENT

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
    pos = i;
    logDebug("swNavTOF_click:"+pos)

    activeContent = getActiveEditor().find(".swContent");
    activeContent = $("#swContent_1").find(".swText_H1");
    var new_position = $(activeContent[pos]).position().top - $(activeContent[0]).position().top;
    activeEditor = getActiveEditor().find(".swEditor");
    activeEditor.stop().animate({ scrollTop: new_position }, 500);
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


//////////////CLICK THE BUTTONS IN THE EDITOR////////////////////////////////////////////////////
function btnHideContent(e){
    var $el = $(e);
    $el.parent().parent().find('.swText_Feld').toggle();
    if ($el.parent().parent().find('.swText_Feld').css('display')=='none')
    {
        $el.parent().parent().find('.btnHideContent').text('▼');
    } else {
        $el.parent().parent().find('.btnHideContent').text('▲');
    }

    logInfo("Ausgewaehltes Element: "+$el.parent().parent().attr("id"))
}

function btnRemoveContent(e){
 var $el = $(e);
    $el.parent().parent().remove();
    updateNavList();
}
   

$( "#swNavList" ).sortable({
    start: function(e, ui) {
        OPTIONS.tmpDragPosStart = ui.item.index();
    },
    update: function(event,ui ) {
      OPTIONS.tmpDragPosEnd = ui.item.index();
      swContentReplace();
      
    }
});



///// XX: EIN PAAR KLICK FUNKTIONEN
$(".swProjectRow").on("dblclick", function(){
    logDebug("dbl:swProjects"+$(this).attr("id"))
})


///// btnNAV >>> das sind fast alle Buttons
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
        case "btnNewText_1":
            addEntryEditor_1("neu","",[]);    
            break;   
        case "btnNewText_2":
            addEntryEditor_2("neu","",[]);    
            break;        
        case "btnEditor2_close":
            OPTIONS.Layout.swMainEditor_2 = false;
            
            updateMainColWidth();   
            setActiveEditor(1); 
            break;                    
        default:
            logDebug(idStr+"[btnNav]: id not found");
            break
    }
});



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

    if (OPTIONS.Layout.swMainEditor_2 == false ){
        colEditor_2 = 0;
        setActiveEditor(1);
        $("#swMainContent_2").hide();
    }else {
        colEditor_2 = OPTIONS.Layout.swMainEditor_2_Width;
        $("#swMainContent_2").show();
    }

    if (OPTIONS.Layout.MenuFont.enabled == false ){
        $("#swMenuFont").hide();
    }else {
        $("#swMenuFont").show();
    }

    //now remove class and set new
    $("#swMainProject").removeClass($("#swMainProject").attr('class'));
    $("#swMainProject").addClass("colSW col-sm-"+colProj);

    $("#swMainNav").removeClass($("#swMainNav").attr('class'));
    $("#swMainNav").addClass("colSW col-sm-"+colNav);

    $("#swMainOptions").removeClass($("#swMainOptions").attr('class'));
    $("#swMainOptions").addClass("colSW col-sm-"+colOpt);

    var colW = 12-(colOpt+colNav+colProj+colEditor_2);
    $("#swMainContent_1").removeClass($("#swMainContent_1").attr('class'));
    $("#swMainContent_1").addClass("colSW col-sm-"+colW);
    $("#swMainContent_2").removeClass($("#swMainContent_2").attr('class'));
    $("#swMainContent_2").addClass("colSW col-sm-"+colEditor_2);
    
    if ($("#swMainContent_2").attr("value") == "off" | OPTIONS.Layout.swMainEditor_2 == false){
        setActiveEditor(1);
    };

}


// addEntryEditor_1(idStr, h1Str, txtStr ) -> ADD AN ENTRY (i.e. addEntryEditor_1([],[],[]))
// 2) emptyEditor_1() -> REMOVE ALL ENTRIES
function addEntryEditor_1(idStr, h1Str, txtStr ){
    if (h1Str == ""){
        Nel = $("#swContent").find(".swText_Feld").length;
        h1Str = Nel + ". Ueberschrift";
    }

console.log('kommt noch!')

}



function setActiveEditor(num){
    $(".swEditor").removeClass("bg_color_highlight").parent().attr({"value":"off"});;
    switch (num){
        case 1:
           $el = $("#swMainContent_1");  
           OPTIONS.Layout.swMainEditor_ACTIVE = 1;
           break
        case 2:
            $el = $("#swMainContent_2"); 
            OPTIONS.Layout.swMainEditor_ACTIVE  = 2;
            break      
    }
    $el.attr({"value":"on"}).find(".swEditor").addClass("bg_color_highlight");
}

function getActiveEditor(){
    if (OPTIONS.Layout.swMainEditor_ACTIVE  == 1){
        activeEditor = $("#swMainContent_1");
    }
    else {
        activeEditor = $("#swMainContent_2");
    }
    return activeEditor
}

// highlight the last clicked Editor and update VALUE field
$(".swEditor").click(function(){
    if($(this).parent().attr("id")=="swMainContent_1"){
        setActiveEditor(1);
    } else {
        setActiveEditor(2);
    }
})