'use strict';

var $ = require( 'jquery' );

function positionNotes( animating, expandable ) {
  var $notes = $( '.educational-note div' );

  // Check that we're on desktop
  if ( $notes.css( 'position' ) === 'absolute' ) {
    var notePositions = [];

    $notes.each( function( i ) {
      var $this = $( this );
      var $parent = $this.closest( 'tr' );
      // Don't need to position hidden notes (ones in collapsed expandables)
      if ( $parent.is( ':visible' ) ) {

        // Get the parent table row's offset from the top of the page.
        var parentOffsetTop = $parent.offset().top;

        // Get prev note's bottom offset
        var prevNoteBottom = notePositions[notePositions.length - 1];

        // If the prev note would be overlapped by this note,
        // or would not have a 15px vertical separation,
        // generate an offset value to prevent overlap/add margin
        var offsetFromPrev = 0;
        if ( i > 0 && parentOffsetTop < ( prevNoteBottom + 15 ) ) {
          offsetFromPrev = ( prevNoteBottom - parentOffsetTop ) + 15;
        }

        // Store the bottom position of the note for use
        // in positioning following notes.
        // (30 = top + bottom note padding)
        notePositions.push( parentOffsetTop + offsetFromPrev + $this.outerHeight() );

        if ( expandable ) {
          var expandableOffsetTop = expandable.offset().top;

          // Don't actually reposition any notes above
          // the animating expandable -- just store their positions
          if ( expandableOffsetTop > parentOffsetTop ) {
            return;
          }

          // While animating, hide triggered expandable's child notes
          // (except for first row's), and skip repositioning notes
          // in or below this expandable until animation stops.
          if ( animating && expandableOffsetTop <= parentOffsetTop ) {
            if ( expandable.has( $this ).length > 0 &&
                 expandableOffsetTop < parentOffsetTop ) {
              $this.hide();
            }
            return;
          }

          // TODO: If there is a header note on both the closing
          // expandable & the one following it, they will probably
          // overlap during animation.
          // poss. solution: proactively reposition second note at start of
          // animation, based on calculating
          // height of prev note - height of prev note's row
        }

        // Notes are absolutely positioned, so we adjust their position
        // via top attribute.
        // Outputs are positioned relative to their parent table row,
        // so their top attribute is just offsetFromPrev.
        // Inputs are positioned relative to their parent table, so their top
        // attribute = (parentOffsetTop - tableOffsetTop) + offsetFromPrev.
        if ( $this.hasClass( 'input' ) ) {
          var tableOffsetTop = $this.closest( 'table' ).offset().top;
          $this.css( {
            top: ( ( parentOffsetTop - tableOffsetTop ) + offsetFromPrev ) + 'px'
          } ).show();
        } else {
          $this.css( { top: offsetFromPrev + 'px' } ).show();
        }

      }
    } );

    if ( !animating ) {
      // Make sure we're not overlapping the next section,
      // (but not while we're animating an expandable)
      // TODO: may need proactive offset with closing expandables
      var lastNoteOffset = notePositions[notePositions.length - 1];
      var $nextSection = $( '.next-steps-container' );
      var nextSectionOffset = $nextSection.offset().top;
      // if next section is overlapped, add extra top padding to offset
      if ( nextSectionOffset < lastNoteOffset ) {
        var offsetPadding = lastNoteOffset - nextSectionOffset;
        $nextSection.css( { 'padding-top': ( offsetPadding + 30 ) + 'px' } );
      } else {
        $nextSection.css( { 'padding-top': '30px' } );
      }
    }
  }
}

module.exports = positionNotes;
