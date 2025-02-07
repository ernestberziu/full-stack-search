export interface City {
  name: string;
}

export interface Country {
  country: string;
  countryisocode: string;
}

export interface Hotel {
  hotel_name: string;
  chain_name: string;
  addressline1: string;
  addressline2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  countryisocode: string;
  star_rating: number;
}

export interface SearchResponse {
  hotels: Hotel[];
  countries: Country[];
  cities: City[];
}
