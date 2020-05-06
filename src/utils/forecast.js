const request = require('request');

const forecast = (latitud, longitud, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=8286c9daa75b6952d0241ed47849e65d&query=${longitud},${latitud}`;
    let er;
    request({ url, json: true }, (error, { body }) => {
        try {
            const data = `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degress out. It feels like ${body.current.feelslike} degress out, with humidity of ${body.current.humidity}%t`;
            callback(undefined, data);
        } catch (er) {
            callback(er, undefined);
        }
    });
};

module.exports = forecast;