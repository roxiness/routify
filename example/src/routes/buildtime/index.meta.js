export default async function (instance) {
    await new Promise(resolve => setTimeout(resolve, 1))

    return {
        'processEnv|split': process.env,
    }
}
