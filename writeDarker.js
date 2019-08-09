var Options = new Object();
		Options.PlaySound = false;
		Options.SoundTippUrl = 'media/tipp_sound.wav';
		Options.ZenMode = false;
        Options.KIMode = false;
        Options.MenuOnTop = true;

		// SCRIPT fuer die Menuleiste
		$("#btnToggle").click(function () {
			$("#swMenuItems").toggle();
		});

		$("#btnF").click(function () {
			document.execCommand("bold");
		});

		$("#btnI").click(function () {
			document.execCommand("italic");
		});

		$("#btnSup").click(function () {
			document.execCommand("superscript");
		});

		$("#btnSub").click(function () {
			document.execCommand("subscript");
		});

		$("#btnClean").click(function () {
			document.execCommand("removeFormat");
		});

		$("#btnFont").click(function () {
			document.execCommand("fontName", false, "Comic Sans MS");
		});

		$("#btnFontBig").click(function () {
			var fontSize = parseInt($("#swTextEditor").css("font-size"));
			fontSize = fontSize + 1 + "px";
			$("#swTextEditor").css({
				'font-size': fontSize
			});
		});

		$("#btnFontSmall").click(function () {
			var fontSize = parseInt($("#swTextEditor").css("font-size"));
			fontSize = fontSize - 1 + "px";
			$("#swTextEditor").css({
				'font-size': fontSize
			});
		});

		$("#btnSound").click(function () {
			var btnOpacity = $("#btnSound").css("opacity");
			if (btnOpacity == 1) {
				$("#btnSound").css({
					"opacity": 0.5
				});
				Options.PlaySound = false;
			} else {
				$("#btnSound").css({
					"opacity": 1
				});
				Options.PlaySound = true;
			}
		});

		$("#btnKIMode").click(function () {
			var btnOpacity = $("#btnKIMode").css("opacity");
			if (btnOpacity == 1) {
				$("#btnKIMode").css({"opacity": 0.5});
				Options.KIMode = false;
				$( ".swTextFeld" ).removeClass("context-menu-one");
			} else {
				$("#btnKIMode").css({"opacity": 1});
				Options.KIMode = true;
				$( ".swTextFeld" ).addClass("context-menu-one");
			}
		});

		$("#btnZen").click(function () {
			var btnOpacity = $("#btnZen").css("opacity");
			if (btnOpacity == 1) {
				$("#btnZen").css({"opacity": 0.5});
				displayStr = 'inherit';
				Options.ZenMode = false;
			} else {
				$("#btnZen").css({"opacity": 1});
				displayStr = 'none';
				Options.ZenMode = true;
			}
            $(".noZen").css({'display':displayStr});
            resizeMENU();
		});

		$("#btnCode").click(function () {
			var btnOpacity = $("#btnCode").css("opacity");
			if (btnOpacity == 1) {
				$("#btnCode").css({"opacity": 0.5});
				$("#btnCode").text('Editor');
				Options.PlaySound = false;

				$('#swTextEditor').find('.swTextFeld').each(function(){
					var curEl = this;
					curEl.innerText = curEl.innerHTML;
				})
				//deacitvate buttons
				$('#formatItems').find('.btn').each(function(){
					var $curEl = $(this);
					$curEl.attr('disabled', true);
				})

			} else {
				$("#btnCode").css({"opacity": 1});
				$("#btnCode").text('Code');
				Options.PlaySound = true;

				$('#swTextEditor').find('.swTextFeld').each(function(){
					var curEl = this;
					curEl.innerHTML = curEl.innerText;
				})

				//reacitvate buttons
				$('#formatItems').find('.btn').each(function(){
					var $curEl = $(this);
					$curEl.attr('disabled', false);
				})

			}
		});	

		// RightClick Function
		
        $.contextMenu({
            selector: '.context-menu-one', 
            callback: function(key, options) {
                var m = "clicked: " + key + "text: " + window.getSelection();
                window.console && console.log(m) || alert(m); 
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

        $('.context-menu-one').on('click', function(e){
	        console.log('clicked', this, window.getSelection());
        });

        ///////////////////////////// RESIZE ELEMENTS IF NECESSARY
        $( window ).resize(function() {
            resizeMENU();
          });

        $( window ).scroll(function()   {
            resizeMENU()
        });

          function resizeMENU(){
            var scroll = $(window).scrollTop();
            menuOffsetLeft = $("#swTextEditor").offset();
            posLeft = menuOffsetLeft.left - 20;
            menuOffsetTop = $("#PositionForMenu").offset();
            if (scroll <120)
                posTop = menuOffsetTop.top - $(window).scrollTop();
            else
                posTop = $("#nav").height()+10;

            $("#swMENU").css({"margin-left": posLeft +"px","margin-top": posTop +"px"});
          };

		// SOUND FUNCTIONS ///////////////////////////
		function PlaySoundFunction(optionStr) {
			if (Options.PlaySound) {
				if (optionStr == "tippen") {
					new Audio(Options.SoundTippUrl).play();
				}
			}
		}
		$(document).on('keypress', function (e) {
			//console.log(Options.PlaySound)
			PlaySoundFunction('tippen'); // tipping sound
        });
        
        ////////// MAIN STARTUP FUNCTION
        function MainStartup(){
            resizeMENU()
        }