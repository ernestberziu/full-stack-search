import { Types } from 'mongoose';
import { CityModel, CountryModel, HotelModel } from './models';

export const searchHotels = (query: string) => {
  return HotelModel.aggregate([
    {
      $search: {
        index: 'atlas_search_hotels_index',
        compound: {
          should: [
            {
              text: {
                query,
                path: ['hotel_name', 'country', 'city'],
                score: { boost: { value: 4 } },
              },
            },
            {
              autocomplete: {
                query,
                path: 'hotel_name',
                score: { boost: { value: 3 } },
              },
            },
            {
              autocomplete: {
                query,
                path: 'country',
                score: { boost: { value: 2 } },
              },
            },
            {
              autocomplete: {
                query,
                path: 'city',
                score: { boost: { value: 2 } },
              },
            },
            {
              text: {
                query,
                path: ['chain_name', 'zipcode', 'state', 'addressline1'],
                score: { boost: { value: 1 } },
              },
            },
          ],
        },
        returnStoredSource: true,
      },
    },
    {
      $project: {
        hotel_name: 1,
      },
    },
  ]);
};

export const searchCountries = (query: string) =>
  CountryModel.find(
    {
      country: { $regex: query, $options: 'i' },
    },
    { country: 1 }
  ).lean();

export const searchCities = (query: string) =>
  CityModel.find({
    name: { $regex: query, $options: 'i' },
  }).lean();

export const getHotelById = async (id: string) => {
  const hotel = await HotelModel.findOne(
    { _id: new Types.ObjectId(id) },
    { hotel_name: 1 }
  ).lean();

  if (!hotel) {
    throw new Error(`Hotel with id ${id} not found`);
  }

  return hotel;
};

export const getCountryById = async (id: string) => {
  const country = await CountryModel.findOne(
    { _id: new Types.ObjectId(id) },
    { country: 1 }
  ).lean();

  if (!country) {
    throw new Error(`Country with id ${id} not found`);
  }

  return country;
};

export const getCityById = async (id: string) => {
  const city = await CityModel.findOne(
    { _id: new Types.ObjectId(id) },
    { name: 1 }
  ).lean();

  if (!city) {
    throw new Error(`City with id ${id} not found`);
  }

  return city;
};
