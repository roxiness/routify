export default {
    overview: {
        'new-york': { temperature: 72, conditions: 'Partly Cloudy' },
        london: { temperature: 60, conditions: 'Rain' },
        sydney: { temperature: 82, conditions: 'Sunny' },
        tokyo: { temperature: 75, conditions: 'Cloudy' },
    },
    'new-york': {
        weatherOverview: {
            temperature: 72,
            humidity: 58,
            conditions: 'Partly Cloudy',
            windSpeed: 10,
        },
        forecast: {
            daily: [
                { day: 'Monday', high: 76, low: 60, conditions: 'Mostly Sunny' },
                { day: 'Tuesday', high: 70, low: 57, conditions: 'Rain' },
                { day: 'Wednesday', high: 68, low: 55, conditions: 'Cloudy' },
                { day: 'Thursday', high: 75, low: 58, conditions: 'Sunny' },
                { day: 'Friday', high: 73, low: 56, conditions: 'Partly Cloudy' },
                // Add more days as needed...
            ],
            hourly: [
                { hour: '08:00', temperature: 60, conditions: 'Cloudy' },
                { hour: '09:00', temperature: 61, conditions: 'Partly Cloudy' },
                { hour: '10:00', temperature: 63, conditions: 'Sunny' },
                { hour: '11:00', temperature: 65, conditions: 'Sunny' },
                // Add more hours as needed...
            ],
        },
        history: {
            monthly: [
                { month: 'January', averageTemperature: 32, conditions: 'Snow' },
                { month: 'February', averageTemperature: 35, conditions: 'Cold' },
                { month: 'March', averageTemperature: 45, conditions: 'Windy' },
                // Add more months as needed...
            ],
            annual: [
                { year: 2022, averageTemperature: 55 },
                { year: 2021, averageTemperature: 54 },
                { year: 2020, averageTemperature: 53 },
                // Add more years as needed...
            ],
        },
        alerts: [
            {
                type: 'Flood Warning',
                description: 'Heavy rainfall expected',
                time: '08:00 - 12:00',
            },
        ],
    },
    london: {
        weatherOverview: {
            temperature: 60,
            humidity: 70,
            conditions: 'Cloudy',
            windSpeed: 12,
        },
        forecast: {
            daily: [
                { day: 'Monday', high: 65, low: 50, conditions: 'Showers' },
                { day: 'Tuesday', high: 63, low: 48, conditions: 'Rain' },
                { day: 'Wednesday', high: 60, low: 47, conditions: 'Partly Cloudy' },
                { day: 'Thursday', high: 62, low: 49, conditions: 'Mostly Cloudy' },
                { day: 'Friday', high: 64, low: 51, conditions: 'Sunny' },
                // Add more days as needed...
            ],
            hourly: [
                { hour: '08:00', temperature: 55, conditions: 'Cloudy' },
                { hour: '09:00', temperature: 56, conditions: 'Partly Cloudy' },
                { hour: '10:00', temperature: 58, conditions: 'Sunny' },
                { hour: '11:00', temperature: 59, conditions: 'Sunny' },
                // Add more hours as needed...
            ],
        },
        history: {
            monthly: [
                { month: 'January', averageTemperature: 41, conditions: 'Cold' },
                { month: 'February', averageTemperature: 42, conditions: 'Wet' },
                { month: 'March', averageTemperature: 47, conditions: 'Windy' },
                // Add more months as needed...
            ],
            annual: [
                { year: 2022, averageTemperature: 52 },
                { year: 2021, averageTemperature: 51 },
                { year: 2020, averageTemperature: 50 },
                // Add more years as needed...
            ],
        },
        alerts: [
            {
                type: 'Fog Warning',
                description: 'Thick fog expected',
                time: '06:00 - 09:00',
            },
        ],
    },
    sydney: {
        weatherOverview: {
            temperature: 76,
            humidity: 65,
            conditions: 'Sunny',
            windSpeed: 8,
        },
        forecast: {
            daily: [
                { day: 'Monday', high: 80, low: 66, conditions: 'Sunny' },
                { day: 'Tuesday', high: 78, low: 64, conditions: 'Partly Cloudy' },
                { day: 'Wednesday', high: 75, low: 63, conditions: 'Showers' },
                { day: 'Thursday', high: 77, low: 65, conditions: 'Mostly Sunny' },
                { day: 'Friday', high: 79, low: 66, conditions: 'Sunny' },
                // Add more days as needed...
            ],
            hourly: [
                { hour: '08:00', temperature: 70, conditions: 'Sunny' },
                { hour: '09:00', temperature: 72, conditions: 'Sunny' },
                { hour: '10:00', temperature: 74, conditions: 'Partly Cloudy' },
                { hour: '11:00', temperature: 75, conditions: 'Partly Cloudy' },
                // Add more hours as needed...
            ],
        },
        history: {
            monthly: [
                { month: 'January', averageTemperature: 76, conditions: 'Hot' },
                { month: 'February', averageTemperature: 74, conditions: 'Warm' },
                { month: 'March', averageTemperature: 70, conditions: 'Pleasant' },
                // Add more months as needed...
            ],
            annual: [
                { year: 2022, averageTemperature: 70 },
                { year: 2021, averageTemperature: 69 },
                { year: 2020, averageTemperature: 68 },
                // Add more years as needed...
            ],
        },
        alerts: [
            {
                type: 'Heat Warning',
                description: 'Extreme heat expected',
                time: '12:00 - 16:00',
            },
        ],
    },
    tokyo: {
        weatherOverview: {
            temperature: 72,
            humidity: 60,
            conditions: 'Partly Cloudy',
            windSpeed: 10,
        },
        forecast: {
            daily: [
                { day: 'Monday', high: 75, low: 60, conditions: 'Sunny' },
                { day: 'Tuesday', high: 73, low: 58, conditions: 'Cloudy' },
                { day: 'Wednesday', high: 71, low: 57, conditions: 'Showers' },
                { day: 'Thursday', high: 72, low: 59, conditions: 'Partly Cloudy' },
                { day: 'Friday', high: 74, low: 61, conditions: 'Sunny' },
                // Add more days as needed...
            ],
            hourly: [
                { hour: '08:00', temperature: 67, conditions: 'Cloudy' },
                { hour: '09:00', temperature: 68, conditions: 'Partly Cloudy' },
                { hour: '10:00', temperature: 70, conditions: 'Sunny' },
                { hour: '11:00', temperature: 71, conditions: 'Sunny' },
                // Add more hours as needed...
            ],
        },
        history: {
            monthly: [
                { month: 'January', averageTemperature: 46, conditions: 'Cold' },
                { month: 'February', averageTemperature: 48, conditions: 'Chilly' },
                { month: 'March', averageTemperature: 54, conditions: 'Cool' },
                // Add more months as needed...
            ],
            annual: [
                { year: 2022, averageTemperature: 60 },
                { year: 2021, averageTemperature: 59 },
                { year: 2020, averageTemperature: 58 },
                // Add more years as needed...
            ],
        },
        alerts: [
            {
                type: 'Typhoon Warning',
                description: 'Possible typhoon approaching',
                time: 'Expected within 48 hours',
            },
        ],
    },
}
