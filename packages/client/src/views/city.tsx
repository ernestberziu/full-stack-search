import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { City as CityType } from '../interfaces';

export const City = () => {
  const { id } = useParams() as { id?: string };

  if (!id) {
    throw new Error('Id param is missing');
  }

  const { data, isLoading } = useQuery({
    queryKey: ['city', id],
    queryFn: () => api.get(`/city/${id}`) as Promise<CityType>,
    enabled: !!id,
  });

  if (isLoading) {
    return 'Loading';
  }

  return data?.name;
};
