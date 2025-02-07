import { useDebouncedState } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { SearchResponse } from '../interfaces';

export function Search() {
  const { value, debouncedValue, setValue } = useDebouncedState('', 200);
  const { data } = useQuery({
    queryKey: ['search', debouncedValue],
    queryFn: () =>
      api.get(`/search?q=${debouncedValue}`) as Promise<SearchResponse>,
    enabled: !!debouncedValue,
  });

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {value && (
                  <button className="left-pan" onClick={() => setValue('')}>
                    <i className="fa fa-close"></i>
                  </button>
                )}
              </div>
              {!!data && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {data.hotels.length ? (
                    data.hotels.map((hotel) => (
                      <li key={hotel._id}>
                        <a
                          href={`/hotel/${hotel._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {hotel.hotel_name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No hotels matched</p>
                  )}
                  <h2>Countries</h2>
                  {data.countries.length ? (
                    data.countries.map((country) => (
                      <li key={country._id}>
                        <a
                          href={`/country/${country._id}`}
                          className="dropdown-item"
                        >
                          <i className="fa fa-building mr-2"></i>
                          {country.country}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No countries matched</p>
                  )}
                  <h2>Cities</h2>
                  {data.cities.length ? (
                    data.cities.map((city) => (
                      <li key={city._id}>
                        <a href={`/city/${city._id}`} className="dropdown-item">
                          <i className="fa fa-building mr-2"></i>
                          {city.name}
                        </a>
                        <hr className="divider" />
                      </li>
                    ))
                  ) : (
                    <p>No cities matched</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
