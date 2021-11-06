import axios from 'axios'
axios.interceptors.response.use(res => res.data)

import { parse } from 'marked'

export const fetchRepo = async reponame => ({
    data: await axios('https://api.github.com/repos/' + reponame),
    readme: await axios(`https://raw.githubusercontent.com/${reponame}/master/README.md`),
})

export const fetchRepos = async reponames => Promise.all(reponames.map(fetchRepo))

export const parseReadme = repo => (repo.readme = parse(repo.readme))

export const fixGithubImages = repo => {
    const { default_branch, html_url } = repo.data
    repo.readme = repo.readme.replace(/<img src="(.+?)"/gm, (full, path) => {
        const isAbsolute = path.match(/^(\/\/|\w+:)/)
        return isAbsolute ? full : `<img src="${html_url}/raw/${default_branch}/${path}"`
    })
}
