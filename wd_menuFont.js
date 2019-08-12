
		// SCRIPT fuer die Menuleiste
		$(".btnMenuFont").click(function () {
			logDebug("btnMenuFont_Toggle");
			var idStr = $(this).attr("id");
			switch(idStr){
				case "btnF":
						document.execCommand("bold");
						break
				case "btnI":
						document.execCommand("italic");
						break		
				case "btnSup":
						document.execCommand("superscript");
						break
				case "btnSub":
						document.execCommand("subscript");
						break		
				case "btnClean":
						document.execCommand("removeFormat");
						break
				case "btnFontBig":
						var fontSize = parseInt($("#swContent").css("font-size"));
						fontSize = fontSize + 1 + "px";
						$("#swContent").css({
							'font-size': fontSize
						});
						break
				case "btnFontSmall":
						var fontSize = parseInt($("#swContent").css("font-size"));
						fontSize = fontSize - 1 + "px";
						$("#swContent").css({
							'font-size': fontSize
						});
						break
				case "btnSound":
						var btnOpacity = $("#btnSound").css("opacity");
						if (btnOpacity == 1) {
							$("#btnSound").css({
								"opacity": OPTIONS.Layout.MenuFont.disabledOpacity
							});
							OPTIONS.Sound.enabled  = false;
						} else {
							$("#btnSound").css({
								"opacity": 1
							});
							OPTIONS.Sound.enabled  = true;
						}
						break	
				case "btnCode":
						var btnOpacity = $("#btnCode").css("opacity");
						if (btnOpacity == 1) {
							$("#btnCode").css({"opacity": OPTIONS.Layout.MenuFont.disabledOpacity});
							$("#btnCode").text('Editor');
							$('#swContent').find('.swText_Feld').each(function(){
								var curEl = this;
								curEl.innerText = curEl.innerHTML;
							})
							//deacitvate buttons
							$('#formatItems').find('.btn').each(function(){
								var $curEl = $(this);
								$curEl.attr('disabled', true);
							})
							OPTIONS.CodeView = true;
						} else {
							$("#btnCode").css({"opacity": 1});
							$("#btnCode").text('Code');	
							$('#swContent').find('.swText_Feld').each(function(){
								var curEl = this;
								curEl.innerHTML = curEl.innerText;
							})
			
							//reacitvate buttons
							$('#formatItems').find('.btn').each(function(){
								var $curEl = $(this);
								$curEl.attr('disabled', false);
							})
							OPTIONS.CodeView = false;
						}
						break	
				case "btnMenuFont_toggle":
					if (OPTIONS.Layout.MenuFont.ZenEnabled){
						$(".noZen").show();
						OPTIONS.Layout.MenuFont.ZenEnabled = false;
						$("#btnMenuFont_toggle").css({"float":"none"})
					}else{
						if ($("#swMenuFont_toggle").css('display') == 'none'){
							$("#swMenuFont_toggle").show();
							$("#btnMenuFont_toggle").css({"float":"none"});
							
							OPTIONS.Layout.MenuFont.toggle = true;
						}
						else{
							$("#swMenuFont_toggle").hide();
							$("#btnMenuFont_toggle").css({"float":"right"})
							OPTIONS.Layout.MenuFont.toggle = false;
						}
					}
					break
				case "btnZen":
					if ($(".noZen").css('display') == 'none'){
						$(".noZen").show();
						OPTIONS.Layout.MenuFont.ZenEnabled = false;
						$("#btnMenuFont_toggle").css({"float":"none"})
					}
					else{
						$(".noZen").hide();
						OPTIONS.Layout.MenuFont.ZenEnabled = true;
						$("#btnMenuFont_toggle").css({"float":"right"})
					}
					break;
				case "btnKIMode":
					var btnOpacity = $("#btnKIMode").css("opacity");
					if (btnOpacity == 1) {
						$("#btnKIMode").css({"opacity": OPTIONS.Layout.MenuFont.disabledOpacity});	
						OPTIONS.Layout.MenuFont.KIEnabled = true;
						$( ".swText_Feld" ).removeClass("context-menu-KI");
					} else {
						$("#btnKIMode").css({"opacity": 1});
						OPTIONS.Layout.MenuFont.KIEnabled = false;
						$( ".swText_Feld" ).addClass("context-menu-KI");
					}
					break
				default:
					logDebug(idStr+": id not found");
					break
			}
		});

		// RightClick Function
        $.contextMenu({
            selector: '.context-menu-KI', 
            callback: function(key, options) {
                var m = "clicked: " + key + "; text: " + window.getSelection();
                logStatus("Selected: "+m); 
            },
            items: {
                "edit": {name: "Edit", icon: "edit"},
                "cut": {name: "Cut", icon: "cut"},
                "copy": {name: "Copy", icon: "copy"},
                "paste": {name: "Paste", icon: "paste"},
                "delete": {name: "Delete", icon: "delete"},
                "sep1": "---------",
                "quit": {name: "Quit"}
            }
        });

        $('.context-menu-KI').on('click', function(e){
	        logStatus('clicked', this, window.getSelection());
        });

      /////// MAIN FUNCTION TO SET THE MENUFONT NAV BAR ///////////
          function updateMenuFont(){

			if (OPTIONS.Layout.MenuFont.enabled){
				$("#swMenuFont").show();
			}
			
          };

		// SOUND FUNCTIONS ///////////////////////////
		function PlaySoundFunction(optionStr) {
			if (OPTIONS.Sound.enabled) {
				if (optionStr == "tippen") {
					new Audio(OPTIONS.Sound.TippUrl).play();
				}
			}
		}
		$(document).on('keypress', function (e) {
			//console.log(Options.PlaySound)
			PlaySoundFunction('tippen'); // tipping sound
        });
        
        