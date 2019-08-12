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

        OPTIONS.Debug = new Object()
        OPTIONS.Debug.enabled = true;
        OPTIONS.Debug.TextLength = 60;
        OPTIONS.Sound = new Object();
        OPTIONS.Sound.enabled = false;
        OPTIONS.Sound.TippUrl = 'media/tipp_sound.wav';
        OPTIONS.CodeView = false;

        OPTIONS.Store_LocalName = "wd_STORAGE";
        
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

        //DATA STORAGE LOCALLY
        $(".btnStore").click(function(){
            var idStr = $(this).attr("id");
            switch(idStr){
                case "btnProjStore":
                        logDebug("storeLocally");

                        var content = new Array();
                        $elH1 = $("#swMainEditor").find(".swText_H1");
                        $elTXT = $("#swMainEditor").find(".swText_Feld");

                        for (i = 1; i<$elH1.length; i++){
                            var data = new Object();
                            data.H1 = $elH1[i].innerHTML;
                            data.TXT = $elTXT[i].innerHTML;
                            content.push(data);
                        }

                        var wd_STORAGE = new Object();
                        wd_STORAGE.content = content;
                        wd_STORAGE.OPTIONS = OPTIONS;

                        // check for previously stored data
                        var oldDataFound = false;
                        for (i=0; i<window.localStorage.length; i++){
                            if (window.localStorage.key(i) == OPTIONS.Store_LocalName)
                                oldDataFound = true;
                        }

                        if (oldDataFound)
                        alert("hi")

                        window.localStorage.setItem(OPTIONS.Store_LocalName, JSON.stringify(wd_STORAGE));
                        $("#swBottomNavTxt").text(" lokal gespeichert in "+OPTIONS.Store_LocalName);

                    break
                case "btnProjLoad":
                        logDebug("loadLocally")
                        wd_STORAGE = JSON.parse(window.localStorage.getItem('wd_STORAGE'));
                        console.log(wd_STORAGE)

                    break
                default:
					logDebug(idStr+": id not found");
					break
            }
        });

        //UPDATE NAVLIST WHEN H:EADING WAS LEFT
		$(".swText_H1").focusout(function(){
            updateNavList();
		})

		function updateNavList(){
			$("#swNavList").html("");
			var firstLoop = 0;
			$("#swContent").find(".swText_H1").each(function(){
				var $curEl = $(this);
				firstLoop += 1;
				if (firstLoop >1){
					var str = "<p>"+$curEl.text()+"</p>";
					$("#swNavList").html($("#swNavList").html() + str);
					var str = "<p>"+$curEl.text()+"</p>";
				}
            })
            logDebug("updateNavList");
		}

		$("#btnNewText").click(function(){
			elX = $(this).parent().parent().find("#swContent_X").clone(true);
			Nel = $("#swContent").find(".swText_Feld").length;
			elX.attr("id", "swContent_"+Nel);
			elX.appendTo("#swContent").show();
			$("#swContent").find("#swContent_"+Nel).find(".swText_H1").text( Nel + ". Ueberschrift");
			updateNavList();
		});

		$(".btnRemoveContent").click(function(){
			$(this).parent().remove();
            updateNavList();
            logDebug("click")
		});

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
        
        $(".btnMain").click(function(){
            var idStr = $(this).attr("id");
            switch(idStr){
				case "btnMenuWindows":
                    if ($("#swMainProject").css('display') == 'none'){
                        $("#swMainProject").show();
                        $("#swMainNav").show();
                        OPTIONS.Layout.swMainProject = true;
                        OPTIONS.Layout.swMainNav= true;
                    }
                    else{
                        $("#swMainProject").hide();
                        $("#swMainNav").hide();
                        OPTIONS.Layout.swMainProject = false;
                        OPTIONS.Layout.swMainNav= false;
                    }
                    updateMainColWidth();
                    break
                case "btnMenuOptions":
                    if ($("#swMainOptions").css('display') == 'none'){
                        $("#swMainOptions").show();
                        OPTIONS.Layout.swMainOpt = true;
                    }
                    else{
                        $("#swMainOptions").hide();
                        OPTIONS.Layout.swMainOpt = false;
                    }
                    updateMainColWidth();
                    break
                case "btnMenuWords":
                    if ($("#swMenuFont").css('display') == 'none'){
                        $("#swMenuFont").show();
                        OPTIONS.Layout.MenuFont.enabled = true;
                    }
                    else{
                        $("#swMenuFont").hide();
                        OPTIONS.Layout.MenuFont.enabled = false;
                    }
                    break;
				default:
					logDebug(idStr+": id not found");
                    break
            }
        })

        $(".btnNav").click(function(){
            var idStr = $(this).attr("id");
            switch(idStr){
                case "swColProjClose":
                    $("#swMainProject").hide();
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
                    $("#swMainNav").hide();
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
                    $("#swMainOptions").hide();
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
                default:
					logDebug(idStr+": id not found");
                    break
            }
        });
	

		function updateMainColWidth(){
			if (OPTIONS.Layout.swMainOpt == false)
				colOpt = 0;
			else
				colOpt = OPTIONS.Layout.swMainOpt_Width;

			if (OPTIONS.Layout.swMainProject == false)
				colProj = 0;
			else
				colProj = OPTIONS.Layout.swMainProject_Width;

			if (OPTIONS.Layout.swMainNav == false )
				colNav = 0;
			else
				colNav = OPTIONS.Layout.swMainNav_Width;

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
        }