$(document).ready(function(){

	// Highlight init
	function initHighlight(wrapperHighlight) {
		hljs.initHighlighting();
		wrapperHighlight(addClipboardJS);
	}

	// Wrap highlight
	function wrapperHighlight(addClipboardJS) {
		$('.hljs').parent().wrap('<div class="hljs-wrapper"></div>');
		$('.hljs-wrapper').prepend('<button class="btn-clipboard" title="Copy to clipboard">Copy</button>');
		addClipboardJS();
	}

	// Add clipboard functionality
	function addClipboardJS() {
		var clipboard = new ClipboardJS(".btn-clipboard",{
            target: function(clipboard) {
                return clipboard.nextElementSibling
            }
        });
        clipboard.on("success", function(clipboard) {
        	$(clipboard.trigger).text('Copied!');
        	setTimeout(function () {
            	$(clipboard.trigger).text('Copy');
        	}, 1000);
            clipboard.clearSelection();
        });
        clipboard.on("error", function(clipboard) {
            var label = /Mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl-";
            var text = "Press " + label + "C to copy";
            $(clipboard.trigger).text(text);
        });
	}

	initHighlight(wrapperHighlight);

	// Style all tables - markdown fix
	$('table').addClass('table');
	$('table thead').addClass('thead-light');

	// Show sidebar on click
    $('#show-sidebar').on('click', function(){
    	$('body').addClass('sidebar-open');
    	$('.sidebar').addClass('sidebar-active');
    });

    // Sidebar li dropdown
    $('.main-nav .li_dropdown .li_parent').on('click', function(){
    	$(this).parent().toggleClass('active');
    });

    // Close sidebar on click
    $(document).on('click', '.sidebar-open', function(e){
    	if($(e.target).hasClass('sidebar-open')) {
    		$('body').removeClass('sidebar-open');
    		$('.sidebar').removeClass('sidebar-active');
    	}
    });

    // Back to top button
    $('#back-to-top').on('click', function(){
    	$("html, body").animate({scrollTop: 0}, 800);
    });

    // Add permalink to headings 2 - 6
    $('.main-content-body h2, .main-content-body h3, .main-content-body h4, .main-content-body h5, .main-content-body h6').each(function(){
		var permalink = $(this).attr('id'),
		text = $(this).text();

		$(this).empty();

		if (permalink !== 'undefined') {
			$(this).append('<a href="#' + permalink + '">' + text + '<i class="fa fa-link" aria-hidden="true"></i></a>');
		}
	});

    // TOC
    if($('.toc').length) {
        // Add title
        var tocTitle = $('<h2><i class="fal fa-list-alt mr-1"></i> Contents</h2>');
        $('.toc').prepend(tocTitle);

        // Add functionality
        $('.toc a').on('click', function(){
            var target = $(this.hash);

            // If there is a tab, get tab of the target and show it
            if($('.nav-tabs').length && $('.tab-pane ' + this.hash).length) {
                var targetTab = $(this.hash)[0].closest('.tab-pane'),
                    targetTabId = $(targetTab).attr('id');
                $('a[href="#'+ targetTabId +'"]').tab('show');
            }

            // Scroll to target
            $('html, body').animate({
                scrollTop: (target.offset().top - 80)
            }, 500);
        });
    }

	// Search function
    if($("#search").length != 0) {
    	$.getJSON('/search/search_index.json').done(searchData);

    	function searchData(data) {
    		var container = $("#searchList");
    		var options = {
				shouldSort: true,
				tokenize: true,
				threshold: 0,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: [
			    	"title"
				]
			};

			var fuse = new Fuse(data.docs, options);

			$('#search').on('keyup', function(){
				var result = fuse.search(this.value);

				// prevent displaying duplicates on search
				var filteredResults = result.filter(function(res) {
					return res.location.match(/(\/#)/g) === null;
				});

				if(filteredResults.length === 0) {
					container.html('');
				} else {
					container.html('');
	    			container.append("<ul><h3>Search results</h3></ul>");
	    		}
				filteredResults.forEach(function(value){
					$("#searchList ul").append("<li><a href='../"+ value.location +"'>" + value.title + "</a></li>");
				});
			});
    	}
	}

	// Lightbox integration
	$(".main-content-body img").each(function () {
		if(!$(this).hasClass('no-lightbox')) {
			if(!$(this).parent("a").length) {
				$(this).wrap(function () { return "<a href=" + this.src + " data-fancybox></a>"; });
			}
		}
	});

	// Navbar scroll
	// navbar background color change on scroll
    function navbarScroll() {
        var scroll = $(window).scrollTop();
        if(scroll < 10){
            $('.navbar-dark').removeClass('dark-mode');
        } else{
            $('.navbar-dark').addClass('dark-mode');
        }
    }
    $(window).scroll(function(){
        navbarScroll();
    });
    navbarScroll();

});

window.intercomSettings = {
    app_id: 'i2hhgdvj',
    system: 'elmah.io'
};
(function () {
    var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', intercomSettings); } else {
        var d = document; var i = function () { i.c(arguments) }; i.q = []; i.c = function (args) { i.q.push(args) }; w.Intercom = i; function l() {
            var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true;
            s.src = 'https://widget.intercom.io/widget/i2hhgdvj';
            var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
        } if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); }
    }
})();
