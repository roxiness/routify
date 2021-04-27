import axios from 'axios'

export default async function () {
    return {
        'kanye|split': (await axios.get('https://api.kanye.rest/')).data.quote,
    }
}
