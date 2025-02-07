import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { Country as CountryType } from '../interfaces';

export const Country = () => {
  const { id } = useParams() as { id?: string };

  if (!id) {
    throw new Error('Id param is missing');
  }

  const { data, isLoading } = useQuery({
    queryKey: ['country', id],
    queryFn: () => api.get(`/country/${id}`) as Promise<CountryType>,
    enabled: !!id,
  });

  if (isLoading) {
    return 'Loading';
  }

  return data?.country;
};
