var $ = jQuery = require('jquery');

var $allNotes, $outputNotes;

function cacheNotes() {
    $allNotes = $('.educational-note div');
    $outputNotes = $allNotes.not('.input');
}

var positionNotes = function (animating, expandable) {
    if (!$allNotes) {cacheNotes();}
    
    $notes = expandable ? $outputNotes : $allNotes;
    
    // Check that we're on desktop
    if ($notes.css('position') === 'absolute') {
        var notePositions = [];
        
        $notes.each(function (i) {
            var $this = $(this);
            var $parent = $this.closest('tr');  
               
            // Don't need to position hidden notes (ones in collapsed expandables)
            if ($parent.is(":visible")) {
                
                // Get the parent table row's offset from the top of the page 
                var parentOffsetTop = $parent.offset().top;
                                
                if (expandable) {
                    var expandableOffsetTop = expandable.offset().top;
                    // Skip any notes above the triggered expandable
                    // on an expand/collapse event
                    if (expandableOffsetTop > parentOffsetTop) {
                        return;
                    }
                    // While animating, hide triggered expandable's child notes
                    // (except for first row's), and skip repositioning notes
                    // in or below this expandable until animation stops.
                    if (animating && expandableOffsetTop <= parentOffsetTop) {
                        if (expandable.has($this).length > 0 && expandableOffsetTop < parentOffsetTop) {
                            $this.hide()
                        }
                        return;
                    }
                }
                
                // Get the height of this note
                var height = $this.height() + 30 // 30 = top + bottom padding;
                
                // Get prev note's bottom offset
                var prevNoteBottom = notePositions[notePositions.length - 1];
            
                // If the prev note would be overlapped by this note,
                // or would not have a 15px vertical separation,
                // generate an offset value to prevent overlap/add margin
                var offsetFromPrev = 0;
                if (i > 0 && parentOffsetTop < (prevNoteBottom + 15)) {
                    offsetFromPrev = (prevNoteBottom - parentOffsetTop) + 15;
                }  
                
                // Notes are absolutely positioned, so we adjust their position
                // via top attribute.
                // Outputs are positioned relative to their parent table row,
                // so their top attribute is just offsetFromPrev.
                // Inputs are positioned relative to their parent table, so their top
                // attribute = (parentOffsetTop - tableOffsetTop) + offsetFromPrev.
                if ($this.hasClass('input')) {
                    var tableOffsetTop = $this.closest('table').offset().top;
                    $this.css({'top': ((parentOffsetTop - tableOffsetTop) + offsetFromPrev) + 'px'}).show();
                } else {
                   $this.css({'top': offsetFromPrev + 'px'}).show();
                }
                
                // Store the bottom position of the note for use
                // in positioning following notes.
                notePositions.push(parentOffsetTop + offsetFromPrev + height);
            } 
        });
        if (!animating) {
            // Make sure we're not overlapping the next section,
            // (but not while we're animating an expandable)
            var lastNoteOffset = notePositions[notePositions.length - 1];
            var $nextSection = $('.next-steps-container');
            var nextSectionOffset = $nextSection.offset().top;
            // if next section is overlapped, add extra top padding to offset
            if (nextSectionOffset < lastNoteOffset) {
                var offsetPadding = lastNoteOffset - nextSectionOffset;
                $nextSection.css({'padding-top': (offsetPadding + 30) + 'px'})
            } else {
                $nextSection.css({'padding-top': '30px'})
            }
        }
    }
}

module.exports = positionNotes;