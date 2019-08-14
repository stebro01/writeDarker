
var DATA;

if (loadProjectLocal() == false)
    initProjectManager()

/* PROJECTMANAGER
DATA > Object das alle Projekte enthaelt:
    DATA["ProjektName"].contentH1
    DATA["ProjektName"].contentTXT
    DATA["ProjektName"].]contentID
//////////////////////// 
//  Folgende Funktionen sind derzeit fertig:
        SAVESTR: TRUE or FALSE >> speichere Arbeitsschritt LOKAL >> call saveProjectLocal()

        1) initProjectManager() > initialisiert DATA als new Object und setzt
            - TRASH
            - Beispielprojekte
            - i.e. initProjectManger();

        2) addProjectWithContent(ProjectStr, h1Str, txtStr, IdStr, SAVESTR) > erstellt ein Projekt
            - addProjectWithContent("trash", [], [], [], false)
            - wenn das Projekt schon existiert wird eine "_1" an den Namen gehangen

        3) removeProject(ProjectStr, SAVESTR) > entfernt ein Projekt mit dem Namen ProjectStr
            - i.e.:  removeProject("trash", false)
                + TRUE: erfolgreich bzw. FALSE wenn Projekt nicht exisierte

        4) addContentToProject(ProjectStr, h1Str, txtStr, IdStr, SAVESTR) > fuegt Inhalt einem Projekt hinzu
            - einzelne Werte: addContentToProject("trash", "h1", "txt1", "id1")
            - oder mehrere: addContentToProject("trash", ["h1", "h2"], ["txt1", "txt2"], [])
        
        5) removeContentFromProject(ProjectStr, entryID, SAVESTR) > entfernt entryID vom Projekt
            - i.e.: removeContentFromProject("Demo 2", 2, SAVESTR)

        6) shiftContentWithinProject(ProjectStr, pos1, pos2, SAVESTR) > tausche zwei Elemente aus in einem Project
            - i.e. shiftContentWithinProject("Demo 2", 0, 2, SAVESTR)

        7) moveContentfromProject1to2(ProjectStr1, ProjectStr2, el1ID, SAVESTR) > bewege ein Element von einem Project
            in ein anderes
            - i.e.: moveContentfromProject1to2("Demo 2", "trash", 1)

        8) moveContentToTrash(ProjectStr, elID, SAVESTR) > bewege ein Content-Objekt in den Trash
            - ie. moveContentToTrash(["Demo 2"], 1)     

        9) restoreContentFromTrash(ProjectStr, elIDTrash, SAVESTR) > bewege ein Content-Objekt in den Trash
            - ie. restoreContentFromTrash(["Demo 2"],1)

        10) deleteTrash(elID, SAVESTR) > loescht das angegebene Element aus dem TRASH
        
    --------------------------------------------------------------------------------
            
        11) saveProjectLocal() > speichert das Projekt in wd_PROJECT    

        12) loadProjectLocal() > lade das Projekt aus window.localStorage.wd_PROJECT    

//  INPROGRESS: Folgende Funktionen sind in Arbeit:


//  TODO: Folgende Funktionen sind geplant:
        + loadProject
        + storeProject
        
    
//  -------- NEEDFUL THINGS: einige nuetzliche Funktionen --------
        + swap_array(ar, p1, p2) > input Array  and pos1 and 2 to swap
        + project_changed(ProjectStr) > changes: DATA[ProjectStr].lastChanged = Date.now();
        + addContentStrToProject(ProjectStr, h1Str, txtStr, IdStr) > basic function for object creation

*/

////// 1) INITPROJECTMANAGER ////////////////
function initProjectManager(){
    DATA = new Object();
    DATA._lastSync = false;
    DATA._needSync = true;
    DATA._creationID = Date.now();
    DATA._creationIDStr = Date();
    DATA._lastChanged = Date.now();
    //add empty TRASH
    addProjectWithContent("trash", [], [], [], false)

    //setup sample data:
   var h1Str = ["Was ist neu?", "Erste Schritte"];
   var txtStr = ["blabla", "laksdjfke sdklfje"];
   addProjectWithContent("Einleitung", h1Str, txtStr, [], false)

   var h1Str = ["Privat", "Erste Amtsdeutsch"];
   var txtStr = ["Das waren keine Privatgespräche!<br> 'Schnuckiputz' ist die Firma, die unsere Büroräume reinigt!", "Bekanntgabe im Amtsblatt: 'Die, die die, die die Rathauswände beschmiert haben, anzeigen, erhalten 100 Euro Belohnung.'"];
   addProjectWithContent("Demo 1", h1Str, txtStr, [], false)

   var h1Str = ["1 Sokrates", "2 Sokrates", "3 Platon"];
   var txtStr = ["Der Kluge lernt aus allem und von jedem, der Normale aus seinen Erfahrungen und der Dumme weiß alles besser.", "Wenn du etwas weitersagen willst, so seihe es zuvor durch drei Siebe: Das Erste läßt nur das Wahre hindurch, das Zweite läßt nur das Gute hindurch, und das Dritte läßt nur das Notwendigste hindurch. Was durch alle drei Siebe hindurchging, das magst du weitersagen.", "Die Philosophen sollen Könige, die Könige Philosophen sein."];
   addProjectWithContent("Demo 2", h1Str, txtStr, [], false)
   console.log("DATA für wd_ProjectManager wurde erfolgreich angelegt");
   saveProjectLocal();
}

////// 2) addProjectWithContent ////////////////
function addProjectWithContent(ProjectStr, h1Str, txtStr, IdStr, SAVESTR){
    //existiert das Projekt schon?
    if (typeof(DATA[ProjectStr]) == "undefined"){
        DATA[ProjectStr] = new Object();
        DATA[ProjectStr].title = ProjectStr;
        DATA[ProjectStr]._creationID = Date.now();
        DATA[ProjectStr]._creationIDStr = Date();
        DATA[ProjectStr]._lastChanged = Date.now();
        DATA[ProjectStr]._lastSync = false;
        DATA[ProjectStr]._needSync = true;
        DATA[ProjectStr].content = new Array();

        // now add the content
        switch (typeof(h1Str)){
            case "string":          
                addContentStrToProject(ProjectStr, h1Str, txtStr, IdStr, SAVESTR)
                break;
            case "object":
                for (i=0;i<h1Str.length;i++){
                    //i.e. addProjectWithContent("Demo 1", ["neu 2", "neu 3"], ["textklsdfkej", "textklsdfkedsfej"], [])
                    addContentStrToProject(ProjectStr, h1Str[i], txtStr[i], IdStr[i], SAVESTR)
                }
                break
        }
    }else
    {
        console.log("DATA["+ProjectStr+"] exisitiert schon! Haenge eine _1 an");
        ProjectStr += "_1";
        addProjectWithContent(ProjectStr, h1Str, txtStr, IdStr, SAVESTR);
    }
}

////// 3) removeProject ////////////////
function removeProject(ProjectStr, SAVESTR){
    if (typeof(DATA[ProjectStr]) == "undefined"){
        //console.log("removeProject:"+ProjectStr+" -> nicht gefunden");
        return false;
    } else 
    {
        project_changed(ProjectStr, SAVESTR);
        delete DATA[ProjectStr];
        //console.log("removeProject:"+ProjectStr+" -> erfolgreich");
        return true;
    }
}

////// 4) addContentToProject ////////////////
function addContentToProject(ProjectStr, h1Str, txtStr, IdStr, SAVESTR){
    // existiert das Projekt schon?
    if (typeof(DATA[ProjectStr]) == "undefined"){
        addProjectWithContent(ProjectStr, h1Str, txtStr, IdStr, SAVESTR);
        project_changed(ProjectStr, SAVESTR);
    } else 
    {
        // detect the type of the input
        
        switch (typeof(h1Str)){
            case "string":
                // i.e. addContentToProject("trash", "h1", "txtuns do", [])
                addContentStrToProject(ProjectStr, h1Str, txtStr, IdStr, SAVESTR)
                break;
            case "object":
                //i.e. addContentToProject("trash", ["h1", "h2"], ["txt1", "txt2"], [])
                for (i=0; i<h1Str.length; i++){
                    tmp_h1Str = h1Str[i];
                    if (typeof(txtStr[i]) == "undefined")
                        tmp_txtStr = [];
                    else
                        tmp_txtStr =txtStr[i];
                    
                    if (typeof(IdStr[i]) == "undefined")
                        tmp_IdStr =[];
                    else
                        tmp_IdStr =IdStr[i];
                    addContentStrToProject(ProjectStr, tmp_h1Str, tmp_txtStr, tmp_IdStr, SAVESTR)    
                }
                break
        } 
    }
}

////// 5) removeContentFromProject ////////////////
function removeContentFromProject(ProjectStr, entryID, SAVESTR){
    if (typeof(DATA[ProjectStr]) == "undefined"){
        return false
    } else {
        //i.e. removeContentFromProject("Demo 2", 2); DATA["Demo 2"].content
        DATA[ProjectStr].content.splice(entryID,1);
         project_changed(ProjectStr, SAVESTR)
        return true
    }
}

////// 6) shiftContentWithinProject ////////////////
function shiftContentWithinProject(ProjectStr, pos1, pos2, SAVESTR){
    //i.e. shiftContentWithinProject("Demo 2", 0, 2); DATA["Demo 2"].content;
    if (typeof(DATA[ProjectStr]) == "undefined"){
        return false
    } else {
        // check if the indices match
        if (pos1<0 | pos2 < 0 | pos1 >= DATA[ProjectStr].content.length | pos2 >= DATA[ProjectStr].content.length){
            console.log("shiftContentWithinProject:outOfDim!");
            return false
        }
        swap_array(DATA[ProjectStr].content, pos1, pos2);
        project_changed(ProjectStr, SAVESTR)
        return true
    }
}

////// 7) moveContentfromProject1to2 ////////////////
function moveContentfromProject1to2(ProjectStr1, ProjectStr2, el1ID, SAVESTR){
    //i.e.: moveContentfromProject1to2("Demo 2", "trash", 1);DATA["trash"].content
    if (typeof(DATA[ProjectStr1]) == "undefined" | typeof(DATA[ProjectStr2]) == "undefined"){
        return false
    }
    else {
        if (el1ID<0 |el1ID >= DATA[ProjectStr1].content.length ){
            console.log("shiftContentWithinProject:outOfDim!");
            return false
        }
        content = DATA[ProjectStr1].content[el1ID];
        DATA[ProjectStr2].content.push(content);
        removeContentFromProject(ProjectStr1, el1ID, SAVESTR)
        project_changed(ProjectStr1, SAVESTR);
        project_changed(ProjectStr2, SAVESTR);
        return true
    }
}

////// 8) moveContentToTrash ////////////////
function moveContentToTrash(ProjectStr, elID, SAVESTR){
    //ie: moveContentToTrash(["Demo 2"], 1); DATA.trash.content
    moveContentfromProject1to2(ProjectStr, "trash", elID, SAVESTR);
    return true
}

////// 9) restoreContentFromTrash ////////////////
function restoreContentFromTrash(ProjectStr, elIDTrash, SAVESTR){
    //ie: restoreContentFromTrash(["Demo 2"], 0); DATA.trash.content
    moveContentfromProject1to2("trash", ProjectStr, elIDTrash, SAVESTR);
    return true
} 

////// 10) restoreContentFromTrash ////////////////
function deleteTrash(ProjectStr, elIDTrash, SAVESTR){
    //ie: restoreContentFromTrash(["Demo 2"], 0); DATA.trash.content
    removeContentFromProject("trash", elIDTrash, SAVESTR);
    return true
} 

////// 11) saveProjectLocal ////////////////
function saveProjectLocal(){
    window.localStorage.setItem("wd_PROJECT", JSON.stringify(DATA));
    console.log("speichere lokale Daten: erfolgreich [DATA -> wd_PROJECT]"+Date());
}

////// 12) loadProjectLocal ////////////////
function loadProjectLocal(){
    DATA = JSON.parse(window.localStorage.getItem("wd_PROJECT"));
    if (DATA == null) {
        console.log("lade lokale Daten: nicht gefunden [wd_PROJECT]");
        return false;
    }
    else{
        console.log("lade lokale Daten: erfolgreich [wd_PROJECT -> DATA]");
        return true;
    }  
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


////////////////// NEEDFUL THINGS

// + swap_array > just change two elements within an array
function swap_array(ar, p1, p2){
    var tmp = ar[p1];
    ar[p1] = ar[p2];
    ar[p2] = tmp;
}

function project_changed(ProjectStr, SAVESTR){
    DATA[ProjectStr]._lastChanged = Date.now();
    DATA[ProjectStr]._needSync = true;
    DATA._lastChanged = Date.now();
    DATA._lastChangedStr = Date();
    DATA._needSync = true;
    if (SAVESTR)
        saveProjectLocal();
}

//just add simple string to the content (now array etc!!!)
function addContentStrToProject(ProjectStr, h1Str, txtStr, IdStr){
    content = new Object();
    content.H1 = h1Str;
    content.TXT = txtStr;
    content.strID = IdStr;
    content._creationID = Date.now();
    content._lastSync = false;
    content._needSync = true;
    DATA[ProjectStr].content.push(content);
    project_changed(ProjectStr);
}

function testTHESEfunctions(){ 
    initProjectManager()
    addContentToProject("trash", ["h1", "h2"], ["txt1", "txt2"], [])
    addContentToProject("Demo 1", ["h1", "h2"], ["txt1", "txt2"], [])

    addProjectWithContent("Demo 1", ["neu 2", "neu 3"], ["textklsdfkej", "textklsdfkedsfej"], [])
    shiftContentWithinProject("Demo 2", 0, 2);
    removeContentFromProject("Demo 2", 2); 
    moveContentfromProject1to2("Demo 1", "Demo 2", 1);
    moveContentToTrash(["Demo 2"], 1); 
    restoreContentFromTrash(["Einleitung"], 0);

    saveProjectLocal()
    loadProjectLocal()

}

   