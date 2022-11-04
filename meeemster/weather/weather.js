var WEATHER_API_URL = "/restFullAPI/v2";
//var WEATHER_API_URL = "http://wetterstation.hof-university.de/restFullAPI/v2/";

$(() => {
	$("#toggle-header").click(() => {
		$("#header").toggle();
	});

	$("#hide-article").click(() => {
		$("#article-one").hide();
	});

	$("#show-hidden-article").click(() => {
		$("#a-secret-hidden-article").show();
	});

	$.ajax({
		url: WEATHER_API_URL,
		type: "GET",
		success: data => {
			$("#weather-datetime").text(data.dateTime);
			$("#weather-temphum").text("Temperature: " + data.temperature + " °C | Humidity: " + data.humidity + "% | Atm. Pressure: " + data.atmosphericPressure + " mbar");
			$("#weather-wind").text("The wind is blowing at " + data.windSpeedKmh + " km/h (" + data.windSpeed + " m/s) in direction " + data.windDirectionString + " (" + data.windDirection + ")");
			$("#weather-other").text("Global Irradiance: " + data.globalIrradiance + " | Precipitation: " + data.precipitation);
			$("#weather-soil").text("Soil Temp.: " + data.soilTemperature + " °C | Soil Humidity: " + data.soilHumidity + "%");
		}
	});
});