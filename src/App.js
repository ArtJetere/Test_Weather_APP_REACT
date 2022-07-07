import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const defaultCitys = localStorage.getItem('weather-citys') ? JSON.parse(localStorage.getItem('weather-citys')) : [];
  const defaultShowDetails = localStorage.getItem('weather-details') ? JSON.parse(localStorage.getItem('weather-details')) : [];

  let [requestedCity, setRequestedCity] = useState('');
  let [citys, setCitys] = useState(defaultCitys);
  let [showDetails, setShowDetails] = useState(defaultShowDetails);
  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('weather-details', JSON.stringify(showDetails));
  }, [showDetails]);
  useEffect(() => {
    localStorage.setItem('weather-citys', JSON.stringify(citys));
  }, [citys]);

  function updateCity(i) {
    const uriEncodedCity = encodeURIComponent(citys[i].name);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${uriEncodedCity}&appid=3017e7cb4801f4c224ec6300fa777420`)
      .then(response => response.json())
      .then(response => {
        if (response.cod !== 200) {
          throw new Error()
        }

      const updatedStatuses = showDetails;
      updatedStatuses[i] = response;
      console.log('__ response : ', response);
      console.log('__ response : ', updatedStatuses);
      setCitys([...updatedStatuses]);
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  function getWeather(e) {
    e.preventDefault();

    if (requestedCity.length === 0) {
      return setError(true);
    }

    setError(false);

    setLoading(true);

    const uriEncodedCity = encodeURIComponent(requestedCity);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${uriEncodedCity}&appid=3017e7cb4801f4c224ec6300fa777420`)
      .then(response => response.json())
      .then(response => {
        if (response.cod !== 200) {
          throw new Error()
        }

      setCitys(current => [...current, response])
      setShowDetails(current => [...current, false])
      setLoading(false);
    })
    .catch(err => {
      setError(true);
      setLoading(false);
      console.log(err.message);
    });
  }

  function updateDetail(i) {
    const updatedStatuses = showDetails;
    updatedStatuses[i] = !updatedStatuses[i];
    setShowDetails([...updatedStatuses]);
  }

  function deleteCity(i) {
    const updatedCitys = citys;
    updatedCitys.splice(i, 1);
    setCitys([...updatedCitys]);
    const updatedStatuses = showDetails;
    updatedStatuses.splice(i, 1);
    setShowDetails([...updatedStatuses]);
  }

  return (
    <div className="App">
      <header className="App-header"><h1>React Weather App</h1></header>
      <main>
        <div>
          <form onSubmit={getWeather}>
            <input
              type="text"
              placeholder="Enter City"
              maxLength="50"
              className="textInput"
              value={requestedCity}
              onChange={(e) => setRequestedCity(e.target.value)}
              />

            <button className="Button" type="submit">Get Weather</button>
          </form>
          <div className="Wrapper">

            {error && <small className="Small">Please enter a valid city.</small>}

            {loading && <div className="Loader" />}


            {citys.length > 0 ? citys.map((city, i) => {
              return (
              <div className="city" key={i}>
                <p><strong>{city.name}</strong></p>
                <p>Temperature: {Math.round(city.main.temp)} degrees.</p>
                <button onClick={() => updateDetail(i)}>More</button>
                <button onClick={() => deleteCity(i)}>Delete</button>
                <button onClick={() => updateCity(i)}>update</button>
                {showDetails[i] && <p>Additional: {city.weather[0].description}.</p>}
              </div>
            )})
            : null
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
