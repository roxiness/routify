import { writable } from 'svelte/store'

export const LocalStorage = instance => {
    const id = instance.localStorage.getItem()
    const { set, update, subscribe } = writable('')

    return { set, update, subscribe }
}
