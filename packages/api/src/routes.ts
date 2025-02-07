import { Request, Router } from 'express';
import { HotelModel } from './models';
import { City, Country, Hotel, SearchResponse } from './interfaces';
import {
  getCityById,
  getCountryById,
  getHotelById,
  searchCities,
  searchCountries,
  searchHotels,
} from './services';

const router = Router();

router.get(
  '/search',
  async (req: Request<void, SearchResponse, void, { q?: string }>, res) => {
    const query = req.query.q;

    if (!query?.length) {
      res.send({ hotels: [], countries: [], cities: [] });
      return;
    }

    try {
      const hotels = await searchHotels(query);

      const [countries, cities] = await Promise.all([
        searchCountries(query),
        searchCities(query),
      ]);

      res.send({ hotels, countries, cities });
    } catch (e) {
      console.log(e);
      throw new Error('Something went wrong');
    }
  }
);

router.get('/hotel/:id', async (req: Request<{ id: string }, Hotel>, res) => {
  if (!req.params.id) {
    throw new Error('Id param is required');
  }

  res.send(await getHotelById(req.params.id));
});

router.get(
  '/country/:id',
  async (req: Request<{ id: string }, Country>, res) => {
    if (!req.params.id) {
      throw new Error('Id param is required');
    }

    res.send(await getCountryById(req.params.id));
  }
);

router.get('/city/:id', async (req: Request<{ id: string }, City>, res) => {
  if (!req.params.id) {
    throw new Error('Id param is required');
  }

  res.send(await getCityById(req.params.id));
});

export default router;
