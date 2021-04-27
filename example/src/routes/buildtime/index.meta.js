import axios from 'axios'

export default async function () {
    const kanye = await axios.get('https://api.kanye.rest/')
    console.log(kanye)
    return {
        'kanye|split': kanye.data.quote,
    }
}
