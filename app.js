
// console.log("JS Link Check");


// function renderweather(data){
        // const newpara = document.createElement('p');
        // newpara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    
        // document.body.appendChild(newpara);
    
    // }
    
    // async function showWeather() {
        //     const lat = 22.572645;
//     const lon = 88.363892;
    
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

//         const data = await response.json();

//         renderweather(data);
//     } catch (e) {
    
//     }    

// }

// async function showCityWeather() {
    //     const city = 'London';
    
    //     try {
        //         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        //         const data = await response.json();
        //         console.log(data);
        
        //         renderweather(data);
        //     } catch (e) {
            
        //     }
        
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grantlocationContainer");
const SearchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading-container");

let currentTab = userTab;

const API_KEY = 'd74ec0c9ec7985e97da22f64aa6cd2dc';

currentTab.classList.add('bg-sky-800', 'rounded');

getfromSessionStorage();

function switchtab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove('bg-sky-800');
        currentTab = clickedTab;
        currentTab.classList.add('bg-sky-800');
        
        if (clickedTab==searchTab) {
            userInfoContainer.classList.add('hidden');
            grantAccessContainer.classList.add('hidden');

            SearchForm.classList.remove('hidden');
        }else{
            SearchForm.classList.add('hidden');

            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click', () => {
    switchtab(userTab);
})

searchTab.addEventListener('click', () => {
    switchtab(searchTab);
})


// check if coordinates is already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    console.log(localCoordinates);

    if(!localCoordinates){
        grantAccessContainer.classList.remove('hidden');
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    
    grantAccessContainer.classList.add('hidden');
    loadingScreen.classList.remove('hidden');
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        const data = await response.json();
        
        loadingScreen.classList.add('hidden');
        
        userInfoContainer.classList.remove('hidden');

        renderWeatherInfo(data);

        
    } catch (e) {
        
    }   
        
}

function renderWeatherInfo(data){

     const cityName = document.querySelector('[data-cityName]');
     const countryIcon = document.querySelector('[data-countryIcon]');
     const desc = document.querySelector('[data-weatherDesc]');
     const weatherIcon = document.querySelector('[data-weatherIcon]');
     const temp = document.querySelector('[data-temp]');
     const windspeed = document.querySelector('[data-windspeed]');
     const humidity = document.querySelector('[data-humidity]');
     const cloudiness = document.querySelector('[data-cloudiness]');

     cityName.innerText = data?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
     let a = data?.weather?.[0]?.description;
     desc.innerText =  a.charAt(0).toUpperCase() + a.slice(1);
     weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
     temp.innerText = data?.main?.temp.toFixed(2) + " \u00B0C";
     windspeed.innerText = data?.wind?.speed + " M/S";
     humidity.innerText = data?.main?.humidity.toFixed(2) + " %";
     cloudiness.innerText = data?.clouds?.all.toFixed(2) + " %";
    

}

function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        grantAccessButton.style.display = 'none';
        console.log("location not getted");
        
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector('[data-searchInput]');

SearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.remove('hidden');
    userInfoContainer.classList.add('hidden');
    grantAccessContainer.classList.add('hidden');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
        const data = await response.json();
        loadingScreen.classList.add('hidden');
        userInfoContainer.classList.remove('hidden');
        renderWeatherInfo(data);

    }
    catch(err){
        
    }
}
