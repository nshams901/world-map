import './CountryCard.css'

const CountryDetailCard = ( { data } : { data: any}) => {
  const { name, capitalCity, region, latitude, longitude } = data || {}
  // console.log(adminregion);
  
  return (
    <div className='card-container'>
      <div className='card text-black'>
        {
          data ?
          <>
          <h3>{ name }</h3>
          <p>Capital: { capitalCity}</p>
          <p>Region: { region?.value}</p>
          <p className='flex items-center' >Location : 
            <span className='text-black'>
            Latitude-{ latitude}, Langitude: { longitude} 
            </span>
          </p>
          </>
          : 
          <h4 className='text-center text-black'>Select a country</h4>
        }
      </div>
    </div>
  )
}

export default CountryDetailCard