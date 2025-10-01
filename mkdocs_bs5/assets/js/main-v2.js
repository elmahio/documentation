document.addEventListener("DOMContentLoaded", function() {
	// Set theme
    setTheme();
    document.querySelector('.mode-switch .btn').addEventListener('click', (e) => {
        const theme = e.currentTarget.querySelector('i:not(.d-none)').id;
        setTheme(theme);
    });

	// Init hljs and add wrapper
	initHighlight(wrapperHighlight);

	// Init gif player
    const gifPlayer = document.querySelectorAll('.gif');
    gifPlayer.forEach((el) => new gifsee(el));

    // Style all tables - markdown fix
    const bsTable = document.querySelectorAll('table');
    bsTable.forEach((el) => {
		el.classList.add('table');
		el.querySelector('thead').classList.add('table-light');
	});

	// Sidebar li dropdown
	const sidebarLi = document.querySelectorAll('.main-nav .li_dropdown .li_parent');
	sidebarLi.forEach((el) => {
		el.addEventListener('click', function (event) {
			event.currentTarget.parentElement.classList.toggle('active');
		});
	});

	// Show sidebar on click
    const showSidebar = document.querySelector('#show-sidebar');
	if (showSidebar) {
		showSidebar.addEventListener('click', function (e) {
			e.stopPropagation();
			document.querySelector('body').classList.add('sidebar-open');
			document.querySelector('.sidebar').classList.add('sidebar-active');
		});
	}

	// Hide sidebar on click
	document.addEventListener('click', function(e) {
		// If the click is outside the sidebar, hide it
		if (!e.target.closest('.sidebar') && !e.target.closest('#show-sidebar')) {
			document.querySelector('body').classList.remove('sidebar-open');
			document.querySelector('.sidebar').classList.remove('sidebar-active');
		}
	});

	// Back to top button
	document.querySelector('#back-to-top').addEventListener('click', () => window.scroll({ top: 0, behavior: 'smooth' }));

    // Add permalink to headings 2 - 6
	const h26 = document.querySelectorAll('.main-content-body h2, .main-content-body h3, .main-content-body h4, .main-content-body h5, .main-content-body h6');
	h26.forEach((el) => {
		const permalink = el.id;
		const text = el.textContent;

		if (permalink) {
			el.innerHTML = `<a href="#${permalink}">${text}<i class="fa fa-link" aria-hidden="true"></i></a>`;
		}

		// Click permalink on headings 2 - 6
		el.addEventListener('click', function(e) {
			e.preventDefault();
			history.pushState(null, null, e.target.href);
			const targetPosition = this.getBoundingClientRect().top + window.scrollY - 80;
			window.scroll({ top: targetPosition, behavior: 'smooth' });
		});
	});

	// TOC
	const toc = document.querySelector('.toc');
	if (toc) {
		const tocHTML = toc.innerHTML; 
		toc.innerHTML = '<h2><i class="fal fa-list-alt me-1"></i> Contents</h2>' + tocHTML;
		toc.querySelectorAll('a').forEach((el) => {
			el.addEventListener('click', function (e) {
				e.preventDefault();
				const target = this.hash;

				// If there is a tab, get tab of the target and show it
				// if (document.querySelectorAll('.nav-tabs').length && document.querySelector('.tab-pane ' + this.hash)) {
				// 	const targetTab = document.querySelector(this.hash).closest('.tab-pane'),
				// 		targetTabId = targetTab.getAttribute('id');
				// 	document.querySelector('a[href="#' + targetTabId + '"]').classList.add('show');
				// 	//new bootstrap.Tab(document.querySelector('a[href="#' + targetTabId + '"]')).show();
				// }

				// Scroll to target
				history.pushState(null, null, e.target.href);
				const targetPosition = document.querySelector(target).getBoundingClientRect().top + window.scrollY - 80;
				window.scroll({ top: targetPosition, behavior: 'smooth' });
			});
		});
	}

	// Persistent tabs
	const bsTabs = document.querySelectorAll('a.nav-link[data-bs-toggle="tab"]');
	bsTabs.forEach((el) => {
		el.addEventListener('click', function(e) {
			// Keep the same scroll position when switching tabs
			const offsetFromTop = e.target.getBoundingClientRect().top;
			requestAnimationFrame(() => {
				const newOffsetFromTop = e.target.getBoundingClientRect().top;
				const scrollAdjustment = newOffsetFromTop - offsetFromTop;
				window.scrollBy(0, scrollAdjustment);
			});
			// ---

			const tabParent = e.currentTarget.closest('ul.nav-tabs');
			const tabData = e.currentTarget.dataset.bsTab;
			let tabs = Array.from(document.querySelectorAll('a.nav-link[data-bs-toggle="tab"][data-bs-tab="'+ tabData +'"]'));
			
			// Filter out tabs that belong to the same nav-tabs group
			tabs = tabs.filter(tab => tab.closest('ul.nav-tabs') !== tabParent);

			if (tabs.length > 0) {
				tabs.forEach((tab) => {
					bootstrap.Tab.getOrCreateInstance(tab).show();
				});
			}
		});
	});

	// Search function
	if (document.querySelector("#search")) {
		fetch('/search/search_index.json').then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(searchData);
	}

	// Lightbox integration
	const contentImages = document.querySelectorAll('.main-content-body img');
	contentImages.forEach((img) => {
		if (!img.classList.contains('no-lightbox') && !img.classList.contains('gif') && !img.classList.contains('emojione')) {
			if (!img.parentElement.matches('a')) {
				const wrapper = document.createElement('a');
				wrapper.href = img.src;
				wrapper.setAttribute('data-fancybox', '');
				img.parentNode.insertBefore(wrapper, img);
				wrapper.appendChild(img);
			}
		}
	});

	// Footer copyright year
	const currentYear = document.querySelector('#currentYear');
	currentYear.textContent = new Date().getFullYear();

	navbarScroll();

	// init Bugster
	Bugster();
});

// On window loaded
window.addEventListener('load', function() {
	// Add fullscreen buttons event listeners
    addFullscreenMode();

	// On load, scroll to permalink
	const hash = window.location.hash.replace('#', '');
	if (hash) {
		const h26 = document.querySelectorAll('.main-content-body h2, .main-content-body h3, .main-content-body h4, .main-content-body h5, .main-content-body h6');
		h26.forEach((el) => {
			const permalink = el.id;
			if (permalink && permalink === hash) {
				// Scroll to target
				const targetPosition = el.getBoundingClientRect().top + window.scrollY - 80;
				setTimeout(() => window.scroll({ top: targetPosition, behavior: 'smooth' }), 0);
			}
		});
	}
});

// On window scroll
window.addEventListener('scroll', function() {
	navbarScroll();
});

// Set theme mode
function setTheme(mode) {
    if (mode) {
        localStorage.setItem('bs-theme', mode);
        document.documentElement.setAttribute('data-bs-theme', mode === 'light' ? 'light' : 'darkmode');
        document.querySelectorAll('button#toggle-theme i').forEach((i) => i.classList.add('d-none'));
    }
    const modeInverse = localStorage.getItem('bs-theme') === 'light' ? 'dark' : 'light';
    document.querySelector('button#toggle-theme i#' + modeInverse).classList.remove('d-none');
    document.querySelector('.mode-switch').classList.remove('d-none');
}

// Initialize highlight JS
function initHighlight(wrapperHighlight) {
    hljs.configure({languages: []});
    hljs.highlightAll();
    wrapperHighlight(addClipboardJS);
    document.body.insertAdjacentHTML('beforeend', '<div class="fullscreen-code js-fullscreen-code"></div>');
}

// Wrap highlight
function wrapperHighlight(addClipboardJS) {
    const hljsElements = document.querySelectorAll('.hljs:not(.language-console), .language-nohighlight');
    hljsElements.forEach((elem) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hljs-wrapper';
        elem.parentElement.parentNode.insertBefore(wrapper, elem.parentElement);
        wrapper.appendChild(elem.parentElement);

        // No highlight, but still an hljs component
        if (elem.classList.contains('language-nohighlight')) {
            elem.classList.add('hljs');
        }
    });

    const hljsWrappers = document.querySelectorAll('.hljs-wrapper');
    hljsWrappers.forEach((elem) => {
        elem.innerHTML += '<div class="hljs-actions-panel"></div>';
    });

    const hljsActionPanels = document.querySelectorAll('.hljs-wrapper .hljs-actions-panel');
    hljsActionPanels.forEach((elem) => {
		elem.innerHTML += '<button class="btn-clipboard" title="Copy to clipboard"><i class="fas fa-copy"></i></button>';
        elem.innerHTML += '<button class="btn-fullscreen-mode" title="Enter fullscreen mode"><i class="fas fa-expand"></i></button>';
    });

	addClipboardJS();
}

// Add clipboard functionality
function addClipboardJS() {
	var clipboard = new ClipboardJS(".btn-clipboard",{
		target: function(clipboard) {
			return clipboard.parentNode.previousElementSibling;
		}
	});
	clipboard.on("success", function(clipboard) {
		clipboard.trigger.innerText = 'Copied!';
		setTimeout(function () {
			clipboard.trigger.innerHTML = '<i class="fas fa-copy"></i>';
		}, 1000);
		clipboard.clearSelection();
	});
	clipboard.on("error", function(clipboard) {
		var label = /Mac/i.test(navigator.userAgent) ? "⌘" : "Ctrl-";
		var text = "Press " + label + "C to copy";
		clipboard.trigger.innerText = text;
	});
}

// Add fullscreen mode functionality
function addFullscreenMode() {
    var isFullScreenModeCodeOn = false;
    const fullScreenWindow = document.querySelector('.js-fullscreen-code');
	const fullscreenBtns = document.querySelectorAll('.btn-fullscreen-mode');

    fullscreenBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => openCloseCodeWindow(e));
    });

    function openCloseCodeWindow(e) {
        e.stopPropagation();
        if (isFullScreenModeCodeOn) {
            document.body.style.overflow = '';
            fullScreenWindow.classList.remove('is-open');
            fullScreenWindow.innerHTML = '';
            isFullScreenModeCodeOn = false;
        } else {
            document.body.style.overflow = 'hidden';
			const codeBlock = e.currentTarget.parentNode.parentNode.cloneNode(true);
			codeBlock.querySelector('.btn-fullscreen-mode').addEventListener('click', (e) => openCloseCodeWindow(e));
			fullScreenWindow.appendChild(codeBlock);
			fullScreenWindow.querySelector('.btn-fullscreen-mode').title = "Leave fullscreen mode";
			fullScreenWindow.querySelector('.btn-fullscreen-mode i').classList.remove('fa-expand');
			fullScreenWindow.querySelector('.btn-fullscreen-mode i').classList.add('fa-compress');
			fullScreenWindow.classList.add('is-open');
            isFullScreenModeCodeOn = true;
        }
    }

    document.addEventListener('keyup', function(e) {
        if (fullScreenWindow.classList.contains('is-open') && e.key === "Escape") {
            document.body.style.overflow = '';
            fullScreenWindow.classList.remove('is-open');
            fullScreenWindow.innerHTML = '';
            isFullScreenModeCodeOn = false;
        }
    });
}

// Navbar scroll - change background color on scroll
function navbarScroll() {
    const navbarDark = document.querySelector('.navbar-dark');
    const scroll = window.scrollY || document.documentElement.scrollTop;

    if (scroll < 10){
        navbarDark.classList.remove('scrolling');
    } else {
        navbarDark.classList.add('scrolling');
    }
}

// Search data function
function searchData(data) {
	const container = document.querySelector('#searchList');
	const options = {
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

	const fuse = new Fuse(data.docs, options);

	document.querySelector('#search').addEventListener('keyup', function() {
		if (this.value) {
			const result = fuse.search(this.value);

			// prevent displaying duplicates on search
			const filteredResults = result.filter(function(res) {
				return res.item.location.match(/(\/#)/g) === null;
			});

			if (filteredResults.length === 0) {
				container.innerHTML = '';
			} else {
				container.innerHTML = '<ul><h3>Search results</h3></ul>';
			}

			filteredResults.forEach(function(value){
				const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '../' + value.item.location;
                a.textContent = value.item.title;
                li.appendChild(a);

				container.querySelector('ul').appendChild(li);
			});
		} else {
			container.innerHTML = '';
		}
	});
}

const escapeHtml = (unsafe) => {
    if(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Bugster
function Bugster() {
	if (!document.querySelector('#bugsterModal')) return;

	const question = document.querySelector('#bugsterModal input#question');
	const bugsterChat = document.querySelector('#bugsterModal .bugster-chat');
	const bugsterChatFooter = document.querySelector('#bugsterModal .modal-footer');
	const bugsterChatFooterCollapse = new bootstrap.Collapse('#bugsterModal .modal-footer', { toggle: false });
	const userDialog = document.querySelector('.bugster-chat .user-dialog');
	const userText = document.querySelector('.bugster-chat .user-dialog-text');
	const bugsterDialog = document.querySelector('.bugster-chat .bugster-dialog');
	const bugsterText = document.querySelector('.bugster-chat .bugster-dialog-text .content');
	const askAnotherQuestion = document.querySelector('#ask-another-question');
	const md = new remarkable.Remarkable();

	// Shortcut questions
	document.querySelectorAll('#bugsterModal a.list-group-item-action').forEach(function(element) {
		element.addEventListener('click', function(event) {
			question.value = event.currentTarget.dataset.question;
			document.querySelector('#bugsterModal button#send-message').click();
		});
	});

	// Submit form
	document.querySelector('#bugster-form').addEventListener('submit', function(event) {
		event.preventDefault();

		if (question.value !== "") {
			userDialog.classList.add('d-none');
			bugsterDialog.classList.add('d-none');

			if (document.querySelector('.bugster-hero').checkVisibility() === false) {
				bugsterChatFooterCollapse.hide();
				bugsterChatFooter.addEventListener('hidden.bs.collapse', event => {
					setTimeout(() => {
						bugsterChat.classList.remove('d-none');
						userText.innerHTML = `<p>${ escapeHtml(question.value) }</p>`;
						userDialog.classList.remove('d-none');

						setTimeout(function() {
							bugsterText.innerHTML = `<div class="spinner-grow spinner-grow-sm" role="status"></div>`;
							bugsterDialog.classList.remove('d-none');
						}, 500);

						setTimeout(() => bugsterXHR(), 1500);
					}, 500);
				});
			}

			fadeOut(document.querySelector('.bugster-hero'), function() {
				bugsterChatFooterCollapse.hide();
				bugsterChatFooter.addEventListener('hidden.bs.collapse', event => {
					setTimeout(() => {
						bugsterChat.classList.remove('d-none');
						userText.innerHTML = `<p>${ escapeHtml(question.value) }</p>`;
						userDialog.classList.remove('d-none');

						setTimeout(function() {
							bugsterText.innerHTML = `<div class="spinner-grow spinner-grow-sm" role="status"></div>`;
							bugsterDialog.classList.remove('d-none');
						}, 500);

						setTimeout(() => bugsterXHR(), 1500);
					}, 500);
				});
			});
		}
	});

	let isRequestInProgress = false;

	const bugsterXHR = () => {
		if (isRequestInProgress) return;

		isRequestInProgress = true;
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "https://bugster2.elmah.io/api/BugsterFunction?code=BjsS-o0CJlpZBunhCFSZ_OqWhlEi9sG7G1cyRlyCOYi3AzFuvoyPPA%3D%3D", true);
		xhr.setRequestHeader("Content-Type", "text/plain");

		xhr.onprogress = function(progressEvent) {
			const { target } = progressEvent;
			if (bugsterText.innerHTML === '<div class="spinner-grow spinner-grow-sm" role="status"></div>') {
				bugsterText.innerHTML = '';
			}
			if (target.status === 200) {
				bugsterText.innerHTML = md.render(target.response);
			}
		};

		xhr.onload = function() {
			if (xhr.status === 200) {
				// Same as in your `done` function in jQuery
				bugsterText.querySelectorAll('pre code').forEach(codeElement => {
					codeElement.parentNode.style.padding = "0px";
					hljs.highlightElement(codeElement);
				});

				bugsterText.querySelectorAll('a').forEach(aElement => {
					aElement.target = "_blank";
					aElement.rel = "noopener noreferrer";
				});

				bugsterText.querySelectorAll('table').forEach(tableElement => {
					tableElement.classList.add('table');
					tableElement.querySelector('thead').classList.add('table-dark');
				});

				askAnotherQuestion.classList.remove('d-none');

				isRequestInProgress = false;
			}
		};

		xhr.send(question.value);
	}

	// Ask another question
	askAnotherQuestion.addEventListener('click', function() {
		askAnotherQuestion.classList.add('d-none');
		question.value = "";
		bugsterChatFooterCollapse.show();
	});

	// Reset modal when closed
	document.querySelector('#bugsterModal').addEventListener('hidden.bs.modal', () => {
		document.querySelector('.bugster-hero').removeAttribute('style');
		bugsterChatFooterCollapse.show();
		bugsterChat.classList.add('d-none');
		askAnotherQuestion.classList.add('d-none');
		question.value = "";
		userDialog.classList.add('d-none');
		userText.innerHTML = '';
		bugsterDialog.classList.add('d-none');
		bugsterText.innerHTML = '';
	});
}

// FadeOut animation
function fadeOut(element, callback) {
    element.style.opacity = 1;
    element.style.transition = 'opacity 0.4s ease';

    requestAnimationFrame(function() {
        element.style.opacity = 0;
    });

    element.addEventListener('transitionend', function handleTransitionEnd(event) {
        // Ensure the event is fired for the opacity property
        if (event.propertyName === 'opacity') {
            element.style.display = 'none';
            element.removeEventListener('transitionend', handleTransitionEnd);
            if (typeof callback === 'function') {
                callback();
            }
        }
    });
}

// Init Fancybox library
Fancybox.bind("[data-fancybox]", {
    idle: false
});

// Intercom
window.intercomSettings = {
	app_id: 'i2hhgdvj',
	system: 'elmah.io',
	background_color: '#0da58e'
};