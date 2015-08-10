var Prosite = Prosite || {};

Prosite.Loading_Effects = {
  
  fly : function( identifier, effect_settings ) {
  
    var cover_identifier = identifier + ' .project-cover',
        $covers          = $(cover_identifier),
        $container       = $covers.closest( identifier ),
        grouping_count   = $covers.length, // default setting for "all" grouping
        speed            = effect_settings.speed,
        delay            = parseFloat( effect_settings.delay ),
        covers_height    = 0,
        $cover           = null,
        i                = 0;
             
     // reset EVERYTHING!
     $container.removeAttr('style');
     $covers.removeAttr('style');
     $covers.removeClass('animation-complete');
     
     // show covers, set to relative position in case they were absolute from a prior animation
     $covers.show();
     
     // get & set height of container
     $container.css( { height   : $container.height(),
                       position : 'relative',
                       overflow : 'hidden' } );
     
     // fixes fading for ie
     if( $.browser.msie ) {
       $covers.find('.project-image').css({ filter : 'inherit' });
     }
     
     switch( effect_settings.grouping ) {

       case "one-by-one":
         grouping_count = 1;
         break;

       case "row-by-row":
       case "column-by-column":
       
         if( typeof Prosite._getSettingsObject === 'function' ) {
           grouping_count = Prosite._getSettingsObject()._template.customizations.cover_containers['work_projects'].per_row;
          } else {
            grouping_count = effect_settings.per_row;
          }
         break;

     } // switch grouping

     $covers.stop();
     
     // get starting positions of covers
     var $self, position;
     $covers.each(function() {
       
       $self    = $(this);
       position = $self.position();
       
       $self.data( 'top', position.top );
       $self.data( 'left', position.left );
       
     });
     
     if( effect_settings.fade === 1 ) {
        $covers.css( { opacity : 0, filter : 'alpha(opacity=0)' } );
      }
     
     // if going last-to-first, just reverse the jQuery array of dom elements
     if( effect_settings.direction == 'last-to-first' ) {
       
       $covers = $($covers.get().reverse());
       
     }
     
     $covers.css( { position : 'absolute' } );
     
     if( effect_settings.direction == 'first-to-last' && effect_settings.grouping == 'one-by-one' ) {
       // first to last and one-by-one puts all the images in the top left
       
       $covers.css( { bottom  : 'auto',
                      right   : 'auto',
                      top     : $($covers[i]).outerHeight(true)*-1,
                      left    : $($covers[i]).outerWidth(true)*-1 } );
       
     }
     else if( effect_settings.direction == 'last-to-first' && effect_settings.grouping == 'one-by-one' ) {
       // last to first and one-by-one puts all the images in the bottom right
       
       $covers.css( { top     : 'auto',
                      left    : 'auto',
                      bottom  : $($covers[i]).outerHeight(true)*-1,
                      right   : $($covers[i]).outerWidth(true)*-1  } ); 
       
     }
     else if( effect_settings.direction == 'first-to-last' && effect_settings.grouping == 'row-by-row' ) {
       // first to last and row-by-row keeps all the images in a row, but hides them up top
       // left and right will be set in the for loop below
       $covers.css( { bottom : 'auto',
                      top    : $($covers[i]).outerHeight(true)*-1 } );
                      
     }
     else if( effect_settings.direction == 'last-to-first' && effect_settings.grouping == 'row-by-row' ) {
       // last to first and row-by-row keeps all the images in a row, but hides them at the bottom
       // left and right will be set in the for loop below
       $covers.css( { top    : 'auto',
                      bottom : $($covers[i]).outerHeight(true)*-1 } );
       
     }
     else if( effect_settings.direction == 'first-to-last' && effect_settings.grouping == 'column-by-column' ) {
        // last to first and row-by-row keeps all the images in a row, but hides them on the left
        // top & bottom will be set in the for loop below
        $covers.css( { right  : 'auto',
                       left   : $($covers[i]).outerWidth(true)*-1 } );

     }
     else if( effect_settings.direction == 'last-to-first' && effect_settings.grouping == 'column-by-column' ) {
         // last to first and col-by-col keeps all the images in a row, but hides them on the right
         // top & bottom will be set in the for loop below
         $covers.css( { left  : 'auto',
                        right   : $($covers[i]).outerWidth(true)*-1 } );

     }
      
     if( effect_settings.grouping == 'row-by-row' ) {
       // row-by-row grouping keeps all the images in a row
       
       for( i = 0; i < $covers.length; i++ ) {
         
         $($covers[i]).css( { left  : $($covers[i]).data('left'),
                              right : 'auto' } ); 
         
       }
       
     }
     else if( effect_settings.grouping == 'column-by-column' ) {
       
       for( i = 0; i < $covers.length; i++ ) {

          $($covers[i]).css( { top    : $($covers[i]).data('top'),
                               bottom : 'auto' } ); 

        }
       
     }
     
     // loop through covers to animate!
          
     if( effect_settings.grouping == 'column-by-column' ) {
       // column-by-column has totally different animating logic
       
       var column_iterator       = 0,
           column_cover_iterator = 0,
           group_tracker         = 0;
       
       for( column_iterator = 0; column_iterator < grouping_count; column_iterator++ ) {
         
         for( column_cover_iterator = column_iterator; column_cover_iterator < $covers.length; column_cover_iterator += grouping_count ) {
           
           $cover = $( $covers[column_cover_iterator] );
           
           // animate each one on its own because we are also using its data to determine the position it should go to
           $cover.delay( delay * 1000 ).animate( { top     : $cover.data('top'), 
                                                   left    : $cover.data('left'), 
                                                   opacity : 1 }, 
                                                  speed * 1000,
                                                  function() { 
                                                    
                                                    if( effect_settings.direction == 'first-to-last' ) {
                                                      // reset by removing the style attr, but then show again because removing style also removes the important display: block
                                                      $(this).removeAttr('style').show();
                                                      if( ++group_tracker == $covers.length ) {
                                                        $covers.addClass('animation-complete');
                                                        $container.removeAttr('style');
                                                      }
                                                    }
                                                    else {
                                                      if( ++group_tracker == $covers.length ) {
                                                        setTimeout( function() {
                                                          $container.removeAttr('style');
                                                          $covers.addClass('animation-complete');
                                                          $covers.removeAttr('style').show();
                                                        }, delay * 1000 );
                                                      }
                                                    }
                                                      
                                                  } );
           
         } // for columns

          delay += parseFloat( effect_settings.delay );
         
       } // for grouping_count
       
     } // column-by-column grouping
     else {
       
       var group_iterator = 0,
           group_tracker  = 0;
       
       for( group_iterator = 0; group_iterator < $covers.length; group_iterator++ ) {
        
          $cover = $($covers[group_iterator]);
        
          $cover.delay( delay * 1000 ).animate( { top     : $cover.data('top'), 
                                                  left    : $cover.data('left'), 
                                                  opacity : 1 },
                                                speed * 1000,
                                                function() {
                                                  
                                                  if( effect_settings.direction == 'first-to-last' ) {
                                                    // reset by removing the style attr, but then show again because removing style also removes the important display: block
                                                    $(this).removeAttr('style').show();
                                                    if( ++group_tracker == $covers.length ) {
                                                      $covers.addClass('animation-complete');
                                                      $container.removeAttr('style');
                                                    }
                                                  }
                                                  else {
                                                    
                                                    if( ++group_tracker == $covers.length ) {
                                                      setTimeout( function() {
                                                        $container.removeAttr('style');
                                                        $covers.addClass('animation-complete');
                                                        $covers.removeAttr('style').show();
                                                      }, delay * 1000 );
                                                    }
                                                  }
                                                  
                                                } );

           if( (group_iterator+1) % grouping_count == 0 ) {
             delay += parseFloat( effect_settings.delay );
           }
        
       } // for grouping
       
     } // grouping other than column-by-column
      
  }, // fly
  
  fade : function( identifier, effect_settings ) {
  
    var cover_identifier = identifier + ' .project-cover',
        $covers          = $(cover_identifier),
        $container       = $covers.closest( identifier ),
        grouping_count   = $covers.length, // default setting for "all" grouping
        speed            = effect_settings.speed,
        delay            = parseFloat( effect_settings.delay ),
        i                = 0;
     
     // RESET EVERYTHING!
     $container.removeAttr('style');
     $covers.removeAttr('style');
     $covers.removeClass('animation-complete');
     
     // show covers
     $covers.show();
     // get & set height of container
     $container.height( $container.height() );
     // hide covers
     $covers.hide();
     
     // fixes fading for ie
     if( $.browser.msie ) {
       $covers.find('.project-image').css({ filter : 'inherit' });
     } 
     
     switch( effect_settings.grouping ) {

       case "one-by-one":
         grouping_count = 1;
         break;

       case "row-by-row":
       
         if( typeof Prosite._getSettingsObject === 'function' ) {
           grouping_count = Prosite._getSettingsObject()._template.customizations.cover_containers['work_projects'].per_row;
          } else {
            grouping_count = effect_settings.per_row;
          }
         break;

     } // switch grouping

     $covers.stop();
     
     if( grouping_count == $covers.length ) {
       
       $covers.fadeIn( speed * 1000, function() {
         
         $covers.addClass('animation-complete');
         
       } );
       
     } // "all" option, no delay involved
     else if( effect_settings.direction == 'first-to-last' ) {
       
       for( i = 0; i < $covers.length; i++ ) {
         
         $($covers[i]).delay( delay * 1000 ).fadeIn( speed * 1000 );

          if( (i+1) % grouping_count == 0 ) {
            delay += effect_settings.delay;
          }
          
          if( i == $covers.length-1 ) {
            $covers.addClass('animation-complete');
          }
         
       }
       
     } // first-to-last
     else {
       // last-to-first
       // do some trickery to show the covers, set visibility to hidden (so they take up space),
       // set visibility to normal right before you fade it in. whoa
       
       $covers.show().css('visibility', 'hidden');
       
       i = $covers.length-1;
       
       function delayed() {
         
         if( i < 0 ) {
           // finished looping through images, clear timeout finally
           clearTimeout( interval );
           $covers.addClass('animation-complete');
           return false;
         }
         
         if( i % grouping_count == 0 ) {
           // clear this timeout, set a new one starting the next delay
            clearTimeout( interval );
            interval = setTimeout( delayed, delay * 1000 );
          }
          else {
            // business as usual
            clearTimeout( interval );
            interval = setTimeout( delayed, 0 );
          }
         
         // prep for fade in: set the visibility back to visible, and hide the cover
         $($covers[i]).hide().css('visibility', 'visible').fadeIn( speed * 1000 );
         
         i--;
         
       }
       
       var interval = setTimeout( delayed, 0 );
              
     } // last-to-first
  
  }, // fade

  wipe : function( identifier, effect_settings ) {
  
    var cover_identifier = identifier + ' .project-cover',
        $covers          = $(cover_identifier),
        $container       = $covers.closest( identifier ),
        $sub_container   = $container.find('ul'),
        speed            = effect_settings.speed,
        container_height = 0,
        container_width  = 0;
     
     // RESET EVERYTHING!
     $container.removeAttr('style');
     $covers.removeAttr('style');
     $sub_container.removeAttr('style');
     $covers.removeClass('animation-complete');
     
     // show covers
     $covers.show();
     
     container_height = $container.height();
     container_width  = $container.width();
     
     // get & set height of container
     $container.css( { height   : container_height,
                       width    : container_width } );
     
     // prep the sub-container
     $sub_container.css( { overflow : 'hidden',
                           height   : container_height,
                           width    : container_width } );
     
     // fixes overflow: hidden for ie
     if( $.browser.msie ) {
       $sub_container.css( { position : 'relative' } );
     }
     
     // stop any running animations
     $covers.stop();
     
     
     // animate
     if( effect_settings.grouping == 'row-by-row' ) {
       
       // just expand the sub-container down
       
       $sub_container.css( { height : 0 } );
       
       $sub_container.animate( { height : container_height }, speed * 1000, function() {
         $covers.addClass('animation-complete');
         $(this).removeAttr('style');
       });
       
     }
     else if( effect_settings.grouping == 'column-by-column' ) {
       // less easy. position covers absolutely, expand the sub-container to the right, then reset       
       
      // set sub_container to position relative so we can get and set positions of covers
      $sub_container.css( { position : 'relative' } );
      
      // get starting positions of covers
       var $self, position;
       $covers.each(function() {

         $self    = $(this);
         position = $self.position();
         
         $self.css( { top : position.top, 
                      left : position.left } );
       }).css( 'position', 'absolute' );
       
       // shrink sub-container
       $sub_container.css( { width : 0 } );
        
        $sub_container.animate( { width : container_width }, speed * 1000, function() {
          $covers.addClass('animation-complete');
        });
      
     }
  
  }, // wipe
  
  slide : function( identifier, effect_settings ) {
  
    var cover_identifier = identifier + ' .project-cover',
        $covers          = $(cover_identifier),
        $container       = $covers.closest( identifier ),
        $sub_container   = $container.find('ul'),
        speed            = effect_settings.speed,
        container_height = 0,
        container_width  = 0;
     
     // RESET EVERYTHING!
     $container.removeAttr('style');
     $covers.removeAttr('style');
     $sub_container.removeAttr('style');
     $covers.removeClass('animation-complete');
     
     // show covers
     $covers.show();
     
     container_height = $container.height();
     container_width  = $container.width();
     
     // get & set height of container
     $container.css( { height   : container_height,
                       width    : container_width,
                       overflow : 'hidden',
                       position : 'relative' } );
     
     // prep the sub-container
     $sub_container.css( { height   : container_height,
                           width    : container_width,
                           position : 'absolute' } );
     
     // stop any running animations
     $covers.stop();
     
     // animate
     if( effect_settings.grouping == 'row-by-row' && effect_settings.direction == 'first-to-last' ) {
       
       $sub_container.css( { top : container_height*-1, left : 0 } );
       
     }
     else if ( effect_settings.grouping == 'row-by-row' && effect_settings.direction == 'last-to-first' ) {
       
       $sub_container.css( { top : container_height, left : 0 } );
       
     }
     if( effect_settings.grouping == 'column-by-column' && effect_settings.direction == 'first-to-last' ) {

        $sub_container.css( { top : 0, left : container_width*-1 } );

      }
      else if ( effect_settings.grouping == 'column-by-column' && effect_settings.direction == 'last-to-first' ) {

        $sub_container.css( { top : 0, left : container_width } );

      }
     
     $sub_container.animate( { top : 0, left : 0 }, speed * 1000, function() {
        $covers.addClass('animation-complete');
        $(this).removeAttr('style');
        $container.removeAttr('style');
      });
  
  } // slide
  
} // Prosite.Loading_Effects