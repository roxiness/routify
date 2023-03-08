import { writable, get } from 'svelte/store'

const USERS = [{ username: 'admin', password: 'password' }]
const GUEST = { username: 'guest', isGuest: true }

const createAuth = () => {
    /** @type {User} */
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
    const store = writable(storedUser || GUEST)

    /** @param {User} user */
    const setUser = user => {
        store.set(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    /**
     * @param {string} username
     * @param {string} password
     */
    const signin = (username, password) => {
        if (USERS.some(user => user.username === username && user.password === password))
            setUser({ isGuest: false, username })
    }

    const signout = () => setUser(GUEST)

    return {
        signin,
        signout,
        subscribe: store.subscribe,
        get: () => get(store),
    }
}

export const auth = createAuth()
