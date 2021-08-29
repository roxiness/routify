import { writable } from 'svelte/store'

export const activeHash = writable(location.hash.replace(/^#/, ''))
