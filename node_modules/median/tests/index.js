var test = require("tap").test
var median = require('../index')

test("testing implementation on odd length [Sorted]", function (t) {
  t.equal( median([1, 2, 45]), 2, "results should be equal 2" )
  t.end()
})

test("testing implementation on odd length [NOT Sorted]", function (t) {
  t.equal( median([1, 45, 2, 6, 5]), 5, "results should be equal 5" )
  t.end()
})

test("testing implementation on even length [Sorted]", function (t) {
  t.equal( median([1, 2, 3, 45]), 2.5, "results should be equal 2.5" )
  t.end()
})

test("testing implementation on even length [NOT Sorted]", function (t) {
  t.equal( median([45, 3, 2, 1]), 2.5, "results should be equal 2.5" )
  t.end()
})