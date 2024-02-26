import { useEffect, useState } from "react";
import './WeatherApp.css'
import ClipLoader from "react-spinners/ClipLoader";

function WeatherApp(){

    const [city, setCity] = useState("-----")
    const [country , setCountry] = useState("-----")
    const [temperatureInCelsius , setTemperatureInCelsius] = useState("");
    const [sky , setSky] = useState("-----")
    const [humidity , setHumidity] = useState("-----")
    const [pressure , setPressure] = useState("-----")
    const [windSpeed , setWindSpeed] = useState("-----")
    const [sunRise , setSunRise] = useState("-----")
    const [sunSet , setSunSet] = useState("-----")
    const [loading , setLoading] =useState(false);

    const [cityName , setCityName] = useState("");
    const handleCityName = (event) => {
        setCityName(event.target.value);
    }

    
    
    

    // useEffect(() => {
        
    //     setLoading(l=> l= true)
    //     console.log("Loading S" , loading)
    //         // const TimeId = setTimeout(() => {
    //         //     console.log("start" , loading)
                
    //         // } , 2000)
            
            
            
            
        
    //         setLoading(l=> l= false)
    //         console.log("Loading E" , loading)
    // } , [city])

    function handleSubmit() {
        if(cityName === ""){
            alert("Please Enter City Name ")
        }else{
        console.log("Inside handleSubmit")
        FetchCordy();
        }
    }
    
    async function FetchCordy(){
        setLoading(true)
        console.log("Inside FetchCordy");
        const encodeInput = encodeURIComponent(cityName);
        try{
            const CoordResponse = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeInput}&format=json&apiKey=879675cd79ef4bdcb2207ee4f2353a49`)
            console.log("Inside try")

            if(!CoordResponse.ok){
                console.log("CoordResponse error from fetch");
                return;
            }
            //console.log(CoordResponse)
            let CoordResponseData = await CoordResponse.json()
            console.log("CoordResponse : " , CoordResponseData)
            const city = CoordResponseData.results[0].name
            const country = CoordResponseData.results[0].country
            const postcode = CoordResponseData.results[0].postcode
            const lat = CoordResponseData.results[0].lat
            const lon = CoordResponseData.results[0].lon

            console.log("country : " , city)
            console.log("country : " , country)
            console.log("postcode : " , postcode)
            console.log("lat : " , lat)
            console.log("lon : " , lon)
            
            if(!city && !country){
                console.log("Coudn't get the City");
                return;
            }
            

            //////////////////////////////////////////

            const FetchWeatherData = await FetchWeather();

            console.log("Calling OpenWeatherMap API")
            async function FetchWeather(){
                try{
                    const weatherDataCoordResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dda2d8d17595fe515e1ef38bcaeb4c9f`)
                    if(!CoordResponse.ok){
                        console.log("OpenWeather API not Okay")
                    }
                    const weatherCoordResponse = await weatherDataCoordResponse.json()
                    console.log("Weather CoordResponse" , weatherCoordResponse)

                    const sunRiseRaw = weatherCoordResponse.sys.sunrise * 1000
                    const sunSetRaw = weatherCoordResponse.sys.sunset * 1000
                    const tempInF =  weatherCoordResponse.main.temp
                    const humidity =  weatherCoordResponse.main.humidity
                    const pressure =  weatherCoordResponse.main.pressure
                    const sky = weatherCoordResponse.weather[0].description
                    const windSpeed = ((weatherCoordResponse.wind.speed ) * 3.6).toFixed(2)

                    const sunRise = new Date(sunRiseRaw).toLocaleTimeString();
                    const sunSet = new Date(sunSetRaw).toLocaleTimeString();
                    
                    const temperatureInKelvin = weatherCoordResponse.main.temp
                    const temperatureInCelsius = (temperatureInKelvin - 273.15).toFixed(2);

                    console.log("Weather SunRise" , sunRise)
                    console.log("Weather Sunset" , sunSet)
                    console.log("Weather Sky" , sky)
                    console.log("Weather Humidity" , humidity)
                    console.log("Weather Pressure" , pressure )
                    console.log("Weather Wind Speed" , windSpeed)
                    console.log("Weather Wind Temperature Celsius" , temperatureInCelsius)
                    
                    
                    setCity(c => c = city)
                    setCountry(c => c = country)
                    setTemperatureInCelsius(t => t =temperatureInCelsius)
                    setSky(s => s = sky)
                    setHumidity(h => h = humidity)
                    setPressure(p => p = pressure)
                    setWindSpeed(w => w = windSpeed)
                    setSunRise(s => s = sunRise)
                    setSunSet(s => s = sunSet)
                        
                }
                catch(error){
                    console.error("Not possible manh , try again !")
                }
            }
        }
        catch(error){
            console.error("It failed , but not you")
        }
    setLoading(false)
    }

    
    // useEffect(() => {
        
    // } , [loading])
    


    return(
        <div className="w-container">
            <div className="search">
                <input className="input-text" type="text" placeholder="eg:City Country" value={cityName} onChange={(event) = handleCityName}/>
                {/* <input className="input-btn" type="button" onClick={handleSubmit} value="Search"/> */}
                {/* {loading ? "Loading..." : "Loaded"} */}
                <button className="input-btn" onClick={handleSubmit}>Search
                </button>
            </div>
            {/* ////////////////////////// */}
            <div className="info-grid">
                <div className="main-info">
                    <div className="c-c">
                    <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="city"/> : city}</p>
                    <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loadercountry"/> : country}</p>
                    </div>
                    <div className="temp">
                    <p className="data"  style={{color:"#14012b" }}>° C</p>
                        {temperatureInCelsius === "" ? "00'0" : `${temperatureInCelsius}`}
                    </div>
                </div>
                <div className="other-info">
                    <p className="item1">
                        <p className="title">sky</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loadersky"/> : sky}</p>
                    </p>
                    <p className="item2">
                        <p className="title">humidity(%)</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loaderhumidity"/> : humidity}</p>
                    </p>
                    <p className="item3">
                        <p className="title">pressure(mb)</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loaderpressure"/> : pressure}</p>
                    </p>
                    <p className="item4">
                        <p className="title">wind(km/h)</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loaderwiwindSpeed"/> :windSpeed}</p>
                    </p>
                    <p className="item5">
                        <p className="title">sun-rise</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loadersunRise"/> : sunRise}</p>
                    </p>
                    <p className="item6">
                        <p className="title">sun-set</p>
                        <p className="data">{loading ? <ClipLoader color="#f9f6fb" loading={loading} size={10} data-testid="loadersunSet"/> :sunSet}</p>
                    </p>
                </div>
            </div>
        </div>
    )

}

export default WeatherApp


//Geoapify key = 879675cd79ef4bdcb2207ee4f2353a49
//Geoapify URL = https://api.geoapify.com/v1/geocode/search?text={CITY name}&format=json&apiKey=879675cd79ef4bdcb2207ee4f2353a49

//OpenWeather key = dda2d8d17595fe515e1ef38bcaeb4c9f
//OpenWeather URL = https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
