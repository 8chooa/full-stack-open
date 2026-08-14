import { useState, useEffect } from 'react'
import countriesServices from './services/countries'
import weatherServices from './services/weather'

const Weather = ({ capital }) => {
    const [ weather, setWeather ] = useState(null)

    useEffect(() => {
        weatherServices.getWeather(capital).then(data => {
            setWeather(data)
        })
    }, [capital])

    if(weather !== null) {

        const iconCode = weather.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        const iconDescription = weather.weather[0].description

        return(
            <div>
                <h2>Weather in {capital}</h2>
                <p>Temperature {weather.main.temp} Celsius</p>
                <img src={iconUrl} alt={iconDescription} />
                <p>Wind {weather.wind.speed} m/s</p>
            </div>
        )
    }
    return null

}


const Country = ({ country }) => {
    return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
                <h2>{Object.keys(country.languages).length > 1 ? 'Languages' : 'Language'}</h2>
                <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img src={country.flags.png} alt={country.flags.alt} />
                <Weather capital={country.capital?.[0]}/>
            </div>
            )
}

const Countries = ({ countries, onSelectedCountry }) => {

    if(countries === null) {
        return null
    } 
        
    if(countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    } 

    if (countries.length > 1 &&  countries.length <= 10) {
        return (
            <div>
                {countries.map((country) => {
                    return(<div key={country.name.official} >
                        <span>{country.name.common}</span> 
                        <button onClick={() => onSelectedCountry(country.name.common)}>Show</button>
                    </div>)
                })}
            </div>
        )
    }

    if(countries.length === 1) {
        return <Country country={countries[0]}/>
    }
}

const App = () => {

    const [ search, setSearch ] = useState('')
    const [ countries, setCountries ] = useState(null)

    useEffect(() => {
        if(search !== '') {
            countriesServices.getAll().then(data => {
                const paisesCoinciden = data.filter((country) => country.name.common.toLowerCase().startsWith(search.toLowerCase()))
                setCountries(paisesCoinciden)                
            })
        } else {
            setCountries(null)
        }
    }, [search])

    const handleChange = (event) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            find countries <input  value={search} onChange={handleChange} />
            {<Countries countries={countries} onSelectedCountry={(name) => setSearch(name)}  />}
        </div>
    )
}

export default App