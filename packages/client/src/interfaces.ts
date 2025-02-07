export interface City {
  _id: string;
  name: string;
}

export interface Country {
  _id: string;
  country: string;
}

export interface Hotel {
  _id: string;
  hotel_name: string;
}

export interface SearchResponse {
  hotels: Hotel[];
  countries: Country[];
  cities: City[];
}
