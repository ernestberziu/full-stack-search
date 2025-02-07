import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { Hotel as HotelType } from '../interfaces';

export const Hotel = () => {
  const { id } = useParams() as { id?: string };

  if (!id) {
    throw new Error('Id param is missing');
  }

  const { data, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => api.get(`/hotel/${id}`) as Promise<HotelType>,
    enabled: !!id,
  });

  if (isLoading) {
    return 'Loading';
  }

  return data?.hotel_name;
};
