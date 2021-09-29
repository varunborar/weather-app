const express = require('express');
const request = require('request');
const dateFormatter = require('./utilities/utilities');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

require('dotenv').config();
const API_KEY = process.env.API_KEY;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})

// ROUTES 

app.get('/', (req, res) => {
    res.render('index', {
        display: false,
        weather: null,
        error: null
    });
})

app.post('/', (req, res) => {
    const city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    request(url, (err, response, body) => {
        if (err) {
            res.render('index', {
                display: false,
                data: null,
                error: "Could not connect to Open Weather Map API"
            });
        } else {
            let weather = JSON.parse(body);
            try {
                let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
                let data = {
                    icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    main: weather.main,
                    place: `${weather.name}, ${regionNames.of(weather.sys.country)} `,
                    time: {
                        sunrise: dateFormatter(weather.sys.sunrise + weather.timezone),
                        sunset: dateFormatter(weather.sys.sunset + weather.timezone)
                    },
                    wind: weather.wind,
                    cloud: {
                        visibilty: weather.visibilty,
                        clouds: weather.clouds.all + "%"
                    }
                };

                console.log(data.time);
                if (weather == null) {
                    res.render('index', {
                        display: false,
                        data: null,
                        error: "Something went wrong, please try again!"
                    });
                } else {
                    res.render('index', {
                        display: true,
                        data,
                        error: null
                    });

                }
            } catch {
                res.render('index', {
                    display: false,
                    data: null,
                    error: "Could not find a city with that name"
                });
            }
        }
    })
});

app.use((req, res) => {
    res.render('404');
})