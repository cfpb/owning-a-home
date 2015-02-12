// @return [Object] Anonymous, self-executing function sets value of queryString.
this.getURLParameter = function ( name ) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,''])[1].replace(/\+/g, '%20')) || null;
};
