jQuery( document ).ready( function() {
        // Uploading files
        var file_frame;
        jQuery( '.upload_image_button' ).live( 'click', function( event ) {
            event.preventDefault();
            // If the media frame already exists, reopen it.
            if ( file_frame ) {
                file_frame.url_input = jQuery( this ).attr( 'data-input' );
                file_frame.open();
                return;
            }
            // Create the media frame.
            file_frame =  wp.media({
                title: 'Please select an image:',
                button: {
                    text: jQuery( this ).data( 'uploader_button_text' ),
                },
                multiple: false  // Set to true to allow multiple files to be selected
            });
            file_frame.url_input = jQuery( this ).attr( 'data-url-input' );
            // When an image is selected, run a callback.
            file_frame.on( 'select', function() {
                // We set multiple to false so only get one image from the uploader
                attachment = file_frame.state().get('selection').first().toJSON();
                // Do something with attachment.id and/or attachment.url here
                jQuery( '#'+file_frame.url_input ).val( attachment.id );
                jQuery( '#'+file_frame.url_input+'_preview' ).attr( 'src', attachment.url );
            });
            // Finally, open the modal
            file_frame.open();
        } );

});
