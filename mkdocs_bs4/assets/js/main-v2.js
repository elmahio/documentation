$(document).ready(function(){

	// Highlight init
	function initHighlight(wrapperHighlight) {
		hljs.highlightAll();
		wrapperHighlight(addClipboardJS);
		$('body').append('<div class="fullscreen-code js-fullscreen-code"></div>');
	}

	// Wrap highlight
	function wrapperHighlight(addClipboardJS) {
		$('.hljs').parent().wrap('<div class="hljs-wrapper"></div>');
		$('.hljs-wrapper').append('<div class="hljs-actions-panel"></div>');
		$('.hljs-wrapper .hljs-actions-panel').prepend('<button class="btn-fullscreen-mode" title="Enter fullscreen mode"><i class="fas fa-expand"></i></button>');
		$('.hljs-wrapper .hljs-actions-panel').prepend('<button class="btn-clipboard" title="Copy to clipboard"><i class="fas fa-copy"></i></button>');
		addClipboardJS();
	}

	// Add clipboard functionality
	function addClipboardJS() {
		var clipboard = new ClipboardJS(".btn-clipboard",{
            target: function(clipboard) {
                return clipboard.parentNode.previousElementSibling
            }
        });
        clipboard.on("success", function(clipboard) {
        	$(clipboard.trigger).text('Copied!');
        	setTimeout(function () {
            	$(clipboard.trigger).html('<i class="fas fa-copy"></i>');
        	}, 1000);
            clipboard.clearSelection();
        });
        clipboard.on("error", function(clipboard) {
            var label = /Mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl-";
            var text = "Press " + label + "C to copy";
            $(clipboard.trigger).text(text);
        });
	}

	// Add fullscreen mode functionality
	function addFullscreenMode() {
		var isFullScreenModeCodeOn = false;
		var screenScroll = 0;
		var fullScreenWindow = $('.js-fullscreen-code')[0];

		$('body').on('click', '.btn-fullscreen-mode', function() {
			if (isFullScreenModeCodeOn) {
				$('body').css('overflow', '');
				$(fullScreenWindow).removeClass('is-open').empty();
				isFullScreenModeCodeOn = false;
			} else {
				var codeBlock = this.parentNode.parentNode.cloneNode(true);
				$('body').css('overflow', 'hidden');
				$(fullScreenWindow).append(codeBlock);
				$(fullScreenWindow).find('.btn-fullscreen-mode').attr('title', 'Leave fullscreen mode');
				$(fullScreenWindow).find('.btn-fullscreen-mode i').removeClass('fa-expand').addClass('fa-compress');
				$(fullScreenWindow).addClass('is-open');
				isFullScreenModeCodeOn = true;
			}
		});

		$(document).keyup(function(e) {
			if($(fullScreenWindow).hasClass('is-open') && e.key === "Escape") {
				$('body').css('overflow', '');
				$(fullScreenWindow).removeClass('is-open').empty();
				isFullScreenModeCodeOn = false;
			}
	   });
	}

	initHighlight(wrapperHighlight);
	addFullscreenMode();

	// Gif Player
	$('.gif').each(function(el){
		new gifsee(this);
	});

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
		var hash = window.location.hash.replace('#', '');
		var permalink = $(this).attr('id'),
		text = $(this).text();

		$(this).empty();

		if (permalink !== 'undefined') {
			$(this).append('<a href="#' + permalink + '">' + text + '<i class="fa fa-link" aria-hidden="true"></i></a>');
		}
	});

	// Click permalink on headings 2 - 6
	$('.main-content-body h2 > a, .main-content-body h3 > a, .main-content-body h4 > a, .main-content-body h5 > a, .main-content-body h6 > a').on('click', function(){
		// Scroll to target
        $('html, body').animate({
            scrollTop: ($(this).offset().top - 80)
        }, 500);
	});

	// On load, scroll to permalink
	$(window).on('load', function() {
		var hash = window.location.hash.replace('#', '');
		if(hash) {
			$('.main-content-body h2, .main-content-body h3, .main-content-body h4, .main-content-body h5, .main-content-body h6').each(function(){
				var permalink = $(this).attr('id');
				if (permalink !== 'undefined' && hash === permalink) {
					// Scroll to target
			        $('html, body').animate({
			            scrollTop: ($(this).offset().top - 80)
			        }, 100);
			        return false;
				}
			});
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
                ignoreLocation: true,
				keys: ["title", "text"]
			};

			var fuse = new Fuse(data.docs, options);

			$('#search').on('keyup', function() {
				if(this.value) {
					var result = fuse.search(this.value);

					// prevent displaying duplicates on search
					var filteredResults = result.filter(function(res) {
						return res.item.location.match(/(\/#)/g) === null;
					});

					if(filteredResults.length === 0) {
						container.html('');
					} else {
						container.html('');
						container.append("<ul><h3>Search results</h3></ul>");
					}
					filteredResults.forEach(function(value){
						$("#searchList ul").append("<li><a href='../"+ value.item.location +"'>" + value.item.title + "</a></li>");
					});
				} else {
                    $("#searchList").empty();
                }
			});
    	}
	}

	// Lightbox integration
	$(".main-content-body img").each(function () {
		if(!$(this).hasClass('no-lightbox') && !$(this).hasClass('gif') && !$(this).hasClass('emojione')) {
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

    // Footer copyright year
    $('#currentYear').text(new Date().getFullYear());

	// Error added on company logo - bug head
	document.querySelector('.bug-head').addEventListener('click', function(){
		throw new Error('Headshot');
	});

	// Persistent tabs
	$('a.nav-link[data-toggle="tab"]').on('click', function (event) {
		var tabParent = event.currentTarget.closest('ul.nav-tabs'),
			tabData = event.currentTarget.dataset.tab,
			tabs = $('a.nav-link[data-toggle="tab"][data-tab="'+ tabData +'"]').filter(function(i, tab) {
				return $(tab).closest('ul.nav-tabs').not(tabParent)[0];
			});

		if (tabs.length > 0) {
			var currentOffset = $(event.currentTarget).offset().top - $(document).scrollTop();
			$(tabs).tab('show');
			$(document).scrollTop($(event.currentTarget).offset().top - currentOffset);
		}
	});
});

window.intercomSettings = {
    app_id: 'i2hhgdvj',
    system: 'elmah.io',
	background_color: '#0da58e'
};