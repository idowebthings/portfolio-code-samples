define( "AGS/Components/Images", [
    "jquery",
    "eventManager",
    "AGS/Utilities/sitecoreUtils",
    "promise-polyfill"
], function ( $, eventManager, sitecoreUtils ) {
    "use strict";

    const Images = {
        init: function () {
            eventManager.subscribe( "ModulesLoadedEvent", function () {
                Images.linkedIconObjectMaker();
            } );
        },
        linkedIconObjectMaker: function () {

            //Helper method to check if attr is true
            $.fn.hasAttr = function ( name ) {
                return this.attr( name ) !== undefined;
            };

            $( 'img.ags-linked-icon' ).each( function ( index ) {
                // Perf tip: Cache the image as $ object so that we don't use the selector muliple times.
                var $img = $( this );
                // get img attributes
                var attributes = $img.prop( 'attributes' );
                // get img source and remove query string
                var src = $img.hasAttr( "src" ) ? $img.attr( "src" ).replace( /\?.*/, '' ) : $img.attr( "data-src" ).replace( /\?.*/, '' );
                // save file extension as variable
                var ext = src.substr( src.lastIndexOf( '.' ) + 1 );
                // if the image is an svg and has browser support
                if ( ext === 'svg' && $( 'html' ).hasClass( 'svg' ) ) {
                    $.get( src, function ( data ) {
                        // get the svg
                        var $svg = $( data ).find( 'svg' );
                        // remove invalid xml
                        $svg = $svg.removeAttr( 'xmlns:a' );
                        // apply attributes
                        $.each( attributes, function () {
                            $svg.attr( this.name, this.value );
                        } );
                        // replace image with svg
                        $img.replaceWith( $svg );
                    } );
                }
            } );
        }
    };

    if ( !sitecoreUtils.prototype.isEditing() ) Promise.resolve().then( Images.init );
} );
