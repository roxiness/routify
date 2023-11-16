import { createLogger } from 'consolite'

export const y = str => `\x1b[33m${str}\x1b[0m`
export const r = str => `\x1b[31m${str}\x1b[0m`
export const p = str => `\x1b[35m${str}\x1b[0m`
// light pink
export const lp = str => `\x1b[38;5;206m${str}\x1b[0m`
// light blue
export const lb = str => `\x1b[38;5;117m${str}\x1b[0m`
export const b = str => `\x1b[34m${str}\x1b[0m`
export const g = str => `\x1b[32m${str}\x1b[0m`
// cyan
export const c = str => `\x1b[36m${str}\x1b[0m`
// bold
export const bold = str => `\x1b[1m${str}\x1b[0m`

const map = {
    // info: b('[info]'),
    debug: c('[debug]'),
    warn: y('[warn]'),
    error: r('[error]'),
}

export const log = createLogger(level => lp('[Routify 3]') + (map[level] || ''))

export const logs = {
    buildTime: (trigger, time) => {
        if (trigger === 'init')
            log.info(bold(`build completed (${Date.now() - time} ms)`))
        else log.info(`rebuild triggered by ${trigger} (${Date.now() - time} ms)`)
    },
    buildTimePluginsList: plugins => {
        log.debug('buildtime plugins:\r\n  ' + g(plugins.map(p => p.name).join('\r\n  ')))
    },
    metaKeysWarning: potentialConflicts => {
        const warning = 'Unrecognized meta keys detected:'
        const note =
            '\r\nFix: Consider prefixing keys with _ or mynamespace_ to avoid future conflicts.\r\nHide: Suppress warnings by setting "ignoreMetaConflictWarnings" to true or an array of keys.'

        const uniqueConflicts = [...new Set(potentialConflicts)].map(str => g(str))
        log.warn([warning, ...uniqueConflicts].join('\r\n  ') + lb(note))
    },
}
