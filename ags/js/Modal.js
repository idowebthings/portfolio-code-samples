define( "AGS/Components/Modal", [
    "jquery",
    "eventManager",
    "AGS/Utilities/sitecoreUtils",
    "promise-polyfill"
], function ( $, eventManager, sitecoreUtils ) {
    "use strict";

    const Modal = {
        init: function () {
            eventManager.subscribe( "ModulesLoadedEvent", function () {
                //Stop iframe video from playing when in modal after close
                $( ".score-modal" ).on( "hidden.bs.modal", function () {
                    var vidFrame = $( ".score-iframe" );
                    var $youtubeIframe = $( ".score-iframe" ).find(
                        "iframe"
                    );

                    if ( vidFrame.length > 0 ) {
                        $youtubeIframe.detach();
                        $( ".score-iframe" ).append( $youtubeIframe );

                    }
                } );
            } );
        }
    };

    if ( !sitecoreUtils.prototype.isEditing() ) Promise.resolve().then( Modal.init );
} );