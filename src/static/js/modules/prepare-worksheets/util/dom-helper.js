// Convert arbitary HTML into a HTMLNode, and append it to a parent element.
// @param node [HTMLNode] The container to append a child to.
// @param str [String] HTML as a raw string.
// @return [HTMLNode] The child that was appended.
this.appendChild = function ( node, str ) {
  var temp = document.createElement('div');
  temp.innerHTML = str;
  if ( temp.children.length > 1 ) {
    throw new Error('Supplied HTML must have one top-level element!');
  }
  return node.appendChild(temp.children[0]);
};