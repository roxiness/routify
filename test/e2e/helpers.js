import { cons } from 'test-hmr/commands'

export const ignoreConsoleWarnings = matcher =>
  function* ignoreConsoleWarnings() {
    yield cons.ignoreWarnings(matcher)
  }

export const goBack = () => ({ page }) => page.goBack()
