
import { fetchRepos, fixGithubImages, parseReadme } from '../../utils/github.js'

const isProduction = process.env.NODE_ENV === 'production' && true

const reponames = [
    'roxiness/routify',
    'roxiness/configent',
    'roxiness/tossr',
    'roxiness/stackmix',
    'roxiness/poindexter',
    'jakobrosenberg/consolite',
]

/**
 * @param {MetaContext} context
 */
export default async ({ split, persist }) => {
    
    /**
     *  Github has a rate limit of 60 requests pr hour.
     *  To get around this we persist the return call.
     *  This will save our data to disk and use it on subsequent requests.
     */
    const repos = await persist(() => fetchRepos(reponames), isProduction)

    repos.forEach(parseReadme)
    repos.forEach(fixGithubImages)

    /**
     * To keep the bundle light, we'll code-split (dynamic import) the individual readme's.
     */
    repos.forEach(repo => (repo.readme = split(repo.readme)))

    return { repos }
}
