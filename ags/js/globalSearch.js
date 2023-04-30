define("AGS/Components/globalSearch", [
    "jquery",
    "eventManager",
    "AGS/Utilities/sitecoreUtils",
    "promise-polyfill"
], function ($, eventManager, sitecoreUtils) {
    "use strict";

    const Search = {
        init: function () {
            //Loading Animation Support
            var newDiv = document.createElement('div');
            newDiv.className = 'acs-loading-animation';

            // add the newly created element and its content into the DOM
            var currentDiv = document.querySelector('ags-search-results-media');
            document.body.insertBefore(newDiv, currentDiv);
            var currntDiv = document.querySelector('acs-content-listing');
            document.body.insertBefore(newDiv, currntDiv);

            $('.acs-loading-animation').html('<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>');

            $('.acs-loading-animation')
                .insertBefore('.ags-search-results-media')
                .css({
                    display: 'inline-block'
                })
                .show();
            $('.acs-loading-animation')
                .insertBefore('.acs-content-listing .acs-content-listing')
                .css({
                    display: 'inline-block'
                })
                .show();


            eventManager.subscribe("ModulesLoadedEvent", function () {
                Search.searchToggle();
            });

            eventManager.subscribe('search-filter-container-apply-filters', function () {
                //to work with search filters
                $('header .score-search-box a').attr('href', '/search');
            });
        },
        searchToggle: function () {
            var searchAndCloseButton = $('.ags-search, .ags-close'),
                searchWrapper = $('.ags-search-wrapper');

            searchAndCloseButton.on('click', function () {
                searchWrapper.toggleClass('opened');
            });

            $(document).mouseup(function (e) {
                //close search if clicked outside of the wrapper
                if (
                    !searchWrapper.is(e.target) && // if the target of the click isn't the wrapper...
                    searchWrapper.has(e.target).length === 0
                ) {
                    // ... nor a descendant of the wrapper
                    searchWrapper.removeClass('opened');
                }
            });
        }
    };

    if (!sitecoreUtils.prototype.isEditing()) Promise.resolve().then(Search.init);
});
