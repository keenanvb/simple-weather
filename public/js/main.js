$(document).ready(function () {
    let APIKEY = ''
    let weather;
    let output = $('#results');
    let containerBoxForcast = $('.container-box-forcast');
    let name = $('#heading');
    let summary = $('#summary');
    let temp = $('#temp');
    let humidity = $('#humidity');
    let tempMin = $('#min');
    let tempMax = $('#max');
    let wind = $('#wind');
    let sunrise = $('#sunrise');
    let sunset = $('#sunset');
    let icon;
    let iconUrl;
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    theDate();

    $('select').change(function () {
        let unit = $('#select').val();
        let input = $('#selectCity').val();
        if (input != '' && unit != '') {
            getWeather(input, unit);
            getForcast(input, unit);
        }
    })

    $("body").keydown(function (e) {
        let input = $('#input').val();
        let unit = $('#select').val();
        if (e.keyCode == 13) {
            if (input == "") {
                $('.input').focus();
            } else {
                getWeather(input, unit);
                getForcast(input, unit);
            }
        }
    });
    /*
     * The date and time
     */
    function theDate() {
        let timer = setInterval(function () {
            let today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            let AM_PM = '';
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);
            AM_PM = AMPM(h);
            $('.time').html(formateDate(days[today.getDay()], today.getDate(), months[today.getMonth()], today.getFullYear()) + '&nbsp ' + h + ':' + m + ':' + s + ' ' + AM_PM);
        }, 1000);

        function formateDate(day, date, month, year) {
            let str = day;
            if (date < 10) {
                str += ', 0' + date;
            } else {
                str += ', ' + date;
            }
            str += ' ' + month + ' ' + year;
            return str;
        }

        function checkTime(i) {
            if (i < 10) {
                i = '0' + i
            };
            return i;
        }

        function AMPM(i) {
            let str = "";
            if (i >= 00 && i <= 18) {
                str = 'AM'
            } else {
                str = 'PM'
            }
            return str;
        }
    }
    /*
     * 5 day forcast
     */

    function getForcast(input, unit) {
        $.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + input + '&cnt=5&appid='+APIKEY+'&units=' + unit, function (data) {
            let content = '';
            for (let i = 0; i < data.list.length; i++) {
                content += '<div>'
                icon = data.list[i].weather[0].icon;
                iconUrl = 'http://openweathermap.org/img/w/' + icon + '.png';
                let date = new Date(data.list[i].dt * 1000)
                content += '<div>' + days[(date.getDay())] + '</div>' +
                    '<div>' + '<img src=' + iconUrl + '>' + '</div>' +
                    '<div>Min: ' + data.list[i].temp.min + '' + tempConverter(unit) + '</div>' +
                    '<div>Max: ' + data.list[i].temp.max + '' + tempConverter(unit) + '</div>'
                content += '</div>';
            }
            containerBoxForcast.html(content);

        }).catch(function (error) {
            console.log(error.responseJSON.message);
        });
    }

    /*
    Get the current weather for city
    */
    function getWeather(input, unit) {
        $.get('http://api.openweathermap.org/data/2.5/weather?q=' + input + '&APPID='+APIKEY+'&units=' + unit, function (data) {
            let sunRise = new Date(data.sys.sunrise * 1000);
            let sunSet = new Date(data.sys.sunset * 1000);
            name.html(data.name);
            summary.html(data.weather[0].main + ': ' + data.weather[0].description);
            temp.html(data.main.temp + '' + tempConverter(unit));
            humidity.html('Humidity: ' + data.main.humidity + '%');
            tempMin.html('Min: ' + data.main.temp_min + '' + tempConverter(unit));
            tempMax.html('Max: ' + data.main.temp_max + '' + tempConverter(unit));
            wind.html('Wind speed: ' + data.wind.speed + ' ' + windConverter(unit) + ' ' + degToCompassPoint(data.wind.deg));
            sunrise.html('Sunrise: 0' + sunRise.getHours() + ':' + sunRise.getMinutes() + '0 AM');
            sunset.html('Sunset: ' + sunSet.getHours() + ':' + sunRise.getMinutes() + '0 PM');
        }).catch(function (error) {
            console.log(error.responseJSON.message);
        });
    };

    function tempConverter(unit) {
        let temp = '';
        if (unit === 'metric') {
            temp = '&#8451'
        } else {
            temp = '&#8457'
        }
        return temp;
    }

    function windConverter(unit) {
        let wind = '';
        if (unit === 'metric') {
            wind = 'km/p';
        } else {
            wind = 'mph';
        }
        return wind;
    }

    function degToCompassPoint(degree) {
        let val = Math.floor((degree / 22.5) + 0.5);
        let compassPoints = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return compassPoints[(val % 16)];
    }
});
