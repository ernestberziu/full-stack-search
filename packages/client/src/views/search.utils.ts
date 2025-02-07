import { InfiniteData } from '@tanstack/react-query';
import { City, Country, Hotel, SearchResponse } from '../interfaces';

export enum ListItemType {
  HOTEL = 'hotel',
  CITY = 'city',
  COUNTRY = 'country',
}

type GroupListItem = { id: string; name: string; type: ListItemType };

export const toGroupedData = (
  paginated: InfiniteData<SearchResponse, number>
): GroupListItem[] => {
  const hotels: Hotel[] = [];
  const countries: Country[] = [];
  const cities: City[] = [];

  for (const page of paginated.pages ?? []) {
    if (page.hotels.docs.length) hotels.push(...page.hotels.docs);

    if (page.countries.length) countries.push(...page.countries);

    if (page.cities.length) cities.push(...page.cities);
  }

  return [
    ...hotels.map((item) => ({
      id: item._id,
      name: item.hotel_name,
      type: ListItemType.HOTEL,
    })),
    ...countries.map((item) => ({
      id: item._id,
      name: item.country,
      type: ListItemType.COUNTRY,
    })),
    ...cities.map((item) => ({
      id: item._id,
      name: item.name,
      type: ListItemType.CITY,
    })),
  ];
};

export const makeGroupCounts = (
  data: GroupListItem[],
  hasNextPage: boolean
): number[] => {
  const hotels = data.filter((item) => item.type === ListItemType.HOTEL).length;

  if (hasNextPage) {
    return [hotels];
  }

  const countries = data.filter(
    (item) => item.type === ListItemType.COUNTRY
  ).length;
  const cities = data.filter((item) => item.type === ListItemType.CITY).length;

  return [hotels, countries, cities];
};
