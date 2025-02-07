import mongoose, { AggregatePaginateModel, Schema } from 'mongoose';
import { City, Country, Hotel } from './interfaces';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const CityModel = mongoose.model(
  'cities',
  new Schema<City>({
    name: String,
  })
);

export const CountryModel = mongoose.model(
  'countries',
  new Schema<Country>({
    country: String,
    countryisocode: String,
  })
);

export const HotelModel = mongoose.model(
  'hotels',
  new Schema<Hotel>({
    hotel_name: String,
    chain_name: String,
    addressline1: String,
    addressline2: String,
    zipcode: String,
    city: String,
    state: String,
    country: String,
    countryisocode: String,
    star_rating: Number,
  }).plugin(mongooseAggregatePaginate)
) as AggregatePaginateModel<Hotel>;
