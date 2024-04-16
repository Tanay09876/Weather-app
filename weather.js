document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".wrapper");
    const inputPart = document.querySelector(".input-part");
    const infoTxt = inputPart.querySelector(".info-txt");
    const inputField = inputPart.querySelector("input");
    const locationBtn = inputPart.querySelector("#getLocationBtn");
    const weatherPart = wrapper.querySelector(".weather-part");
    const wIcon = weatherPart.querySelector("img");
    const arrowBack = wrapper.querySelector("header i");
    const searchBtn = document.getElementById("searchBtn");
    const getLocationBtn = document.querySelector(".get-location-btn");

    const apiKey = "f713a968f9f4061cccbe6ccd5fcdd614";

    let api;

    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inputField.value.trim() !== "") {
            searchBtn.click();
        }
    });

    searchBtn.addEventListener("click", () => {
        const inputValue = inputField.value.trim().toLowerCase();
        if (inputValue === "") {
            infoTxt.innerText = "Please enter a city name";
            infoTxt.classList.add("error");
        } else if (inputValue === "current location" || inputValue === "my location") {
            getLocationBtn.click();
        } else {
            requestApi(inputValue);
        }
    });

    getLocationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            alert("Your browser does not support geolocation.");
        }
    });

    function requestApi(city) {
        api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        fetchData();
    }

    function requestApiByCoordinates(latitude, longitude) {
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        fetchData();
    }

    function onSuccess(position) {
        const { latitude, longitude } = position.coords;
        console.log("Device Coordinates:", latitude, longitude); // Log device coordinates for debugging
        requestApiByCoordinates(latitude, longitude);
    }

    function onError(error) {
        infoTxt.innerText = error.message;
        infoTxt.classList.add("error");
        console.error("Geolocation Error:", error); // Log geolocation errors for debugging
    }

    function fetchData() {
        infoTxt.innerText = "Getting weather details...";
        infoTxt.classList.add("pending");
    
        fetch(api)
            .then((res) => {
                if (!res.ok) {
                    infoTxt.innerText = "City not found";
                    infoTxt.classList.replace("pending", "error");
                    const errorImg = document.createElement("img");
                    errorImg.src = "assest/404.png"; // Path to your 404 error image
                    errorImg.alt = "City not found";
                    infoTxt.appendChild(errorImg);
    
                    // Add text above the 404 image
                    const errorText = document.createElement("div");
                    
                    infoTxt.insertBefore(errorText, errorImg);
    
                    throw new Error("City not found");
                }
                return res.json();
            })
            .then((result) => weatherDetails(result))
            .catch((error) => {
                infoTxt.innerText = "City not found";
                infoTxt.classList.replace("pending", "error");
                const errorImg = document.createElement("img");
                errorImg.src = "assest/404.png"; // Path to your 404 error image
                errorImg.alt = "Error Image";
                infoTxt.appendChild(errorImg);
    
                // Add text above the 404 image
                const errorText = document.createElement("div");
             
                infoTxt.insertBefore(errorText, errorImg);
    
                console.error("Error fetching data:", error);
            });
    }
    

    function weatherDetails(info) {
        if (info.cod === 200) {
            const city = info.name;
            const country = info.sys.country;
            const { description, id } = info.weather[0];
            const { temp, feels_like, humidity } = info.main;

            setWeatherIcon(id, temp); // Pass temperature to setWeatherIcon

            weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
            weatherPart.querySelector(".weather").innerText = description;
            weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
            weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
            weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

            infoTxt.classList.remove("pending", "error");
            infoTxt.innerText = "";
            inputField.value = "";
            wrapper.classList.add("active");
        } else {
            infoTxt.classList.replace("pending", "error");
            infoTxt.innerText = `${inputField.value} city is not found`;
            const errorImg = document.createElement("img");
            errorImg.src = "assest/404.png"; // Path to your error image
            errorImg.alt = "Error Image";
            infoTxt.appendChild(errorImg);
        }
    }

    function setWeatherIcon(weatherId) {
        if (weatherId === 800) {
            wIcon.src = "assest/clear.svg";
        } else if (weatherId >= 200 && weatherId <= 232) {
            wIcon.src = "assest/storm.svg";  
        } else if (weatherId >= 600 && weatherId <= 622) {
            wIcon.src = "assest/snow.svg";
        } else if (weatherId >= 701 && weatherId <= 781) {
            wIcon.src = "assest/haze.svg";
        } else if (weatherId >= 801 && weatherId <= 804) {
            wIcon.src = "assest/cloud.svg";
        } else if ((weatherId >= 500 && weatherId <= 531) || (weatherId >= 300 && weatherId <= 321)) {
            wIcon.src = "assest/rain.svg";
        }
    }
    

    arrowBack.addEventListener("click", () => {
        wrapper.classList.remove("active");
    });
});
