define( "AGS/Components/globalNav", [
    "jquery",
    "underscore",
    "eventManager",
    "AGS/Utilities/sitecoreUtils",
    "promise-polyfill"
], function ( $, _, eventManager, sitecoreUtils ) {
    "use strict";

        const Navigation = {
            init: function () {
                var lastScrollTop = 0;
                Navigation.eventListeners(lastScrollTop);
                Navigation.clickEvents();

                if (matchMedia) {
                    const mq = window.matchMedia("(min-width: 992px)");
                    mq.addListener(Navigation.agsDropdowns);

                    if (mq.matches) {
                        Navigation.agsDropdowns(mq);
                    }
                }           
            },        
            agsDropdowns: function () {
                $(document).on(
                    "focus click",
                    ".ags-global-header .navbar-nav > li:not([class*='ags-']) > a",
                    function () {
                        $(this).parent().addClass("focus-within");
                        $(this)
                            .parent()
                            .siblings(".score-megamenu-dropdown.open")
                            .removeClass("open");
                        $(this)
                            .parent()
                            .siblings(".score-megamenu-dropdown.focus-within")
                            .removeClass("focus-within");
                    }
                );

                $(document).on(
                    "focus click mouseover",
                    ".score-header .navbar-nav > li",
                    function () {
                        $(".score-megamenu-dropdown:not([class*='ags-']).open").removeClass("open");
                        $(".score-megamenu-dropdown:not([class*='ags-']).focus-within").removeClass("focus-within");
                    }
                );

                $(".score-header .navbar-nav > li").hover(function () {
                    $(".score-megamenu-dropdown:not([class*='ags-']).open").removeClass("open");
                    $(".score-megamenu-dropdown:not([class*='ags-']).focus-within").removeClass("focus-within");
                });


                if ($("body.home")) {

                    $(".score-header .navbar-nav > li").on("mouseover", function () {
                        $(".home .score-header .score-navbar-header").css("box-shadow", "none");
                    });

                    $(".score-header .navbar-nav > li").on("mouseout", function () {
                        $(".home .score-header .score-navbar-header").attr("style", "");
                    });
                }

                // Two col dropdowns if more than eight items
                $(".score-megamenu .navbar-nav > li > .dropdown-menu.level-2").each(
                    function () {
                        var subitemcount = $(this).children().length;

                        if (subitemcount > 8) {
                            $(this).addClass('dropdown-2col');
                        }
                    }
                );
            },

            headerScrollLogic: function (scrollTop, lastScrollTop) {
                let header = $("header:not(.ags-global-header)");
                let globalHeader = $("header.ags-global-header");
                let navi = $(".navbar-collapse");

                if (scrollTop > lastScrollTop) {
                    header.removeClass("position-fixed");
                } else {
                    header.addClass("position-fixed");
                }

                if (scrollTop >= 75 && !navi.hasClass("in")) {
                    // reset to initial if scrolled to top of page, IF mobi nav not open
                    header.addClass("scrolled");
                    globalHeader.addClass("scrolled");
                } else {
                    header.removeClass("scrolled");
                    globalHeader.removeClass("scrolled");
                }

                lastScrollTop = scrollTop;
            },
            clickEvents: function () {
                //prevents dropdown from closing when clicked inside
                $(document).on("click", ".score-megamenu .dropdown-menu", function (e) {
                    e.stopPropagation();
                });

                // disable scroll on body
                $('.navbar-toggle').on('click', function () {
                    $('body').toggleClass('nav-open');
                    $("header.ags-global-header .score-megamenu .navbar-nav > li.active, header.ags-global-header .score-megamenu .navbar-nav > li.active-section").addClass("open");
                });

                $("header .ags-close").on("click", function () {
                    $('header .ags-search').toggleClass('open');
                    if (!$('header .ags-search').hasClass('open')) {
                        $(this).find('a:not(.dropdown-toggle)').focus();
                    }
                });
            },
            eventListeners: function (lastScrollTop) {
                $(window).on({
                    scroll: function () {
                        var scrollTop = jQuery(this).scrollTop();
                        _.throttle(Navigation.headerScrollLogic(scrollTop, lastScrollTop), 16)

                        lastScrollTop = scrollTop;
                    }
                });
            }
        }

        if (!sitecoreUtils.prototype.isEditing()) Promise.resolve().then(Navigation.init);
} );
