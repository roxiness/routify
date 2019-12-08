const { thc } = require('test-hmr')
const { page } = require('test-hmr/commands')

const click = selector =>
  function* click() {
    yield page.click(selector)
  }

const goto = url =>
  function* goto() {
    if (url.substr(0, 1) !== '/') {
      const baseUrl = yield page.url()
      yield page.goto(baseUrl + url)
    } else {
      yield page.goto(url)
    }
  }

module.exports = {
  click,
  thc,
  goto,
}
