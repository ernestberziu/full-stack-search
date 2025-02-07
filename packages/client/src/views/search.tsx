import { useDebouncedState } from '../utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api';
import { SearchResponse } from '../interfaces';
import { Components, GroupedVirtuoso } from 'react-virtuoso';
import { makeGroupCounts, toGroupedData } from './search.utils';

export function Search() {
  const { value, debouncedValue, setValue } = useDebouncedState('', 200);

  const {
    data = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search', debouncedValue],
    queryFn: ({ pageParam }) =>
      api.get(
        `/search?q=${debouncedValue}&page=${pageParam}&limit=${10}`
      ) as Promise<SearchResponse>,
    enabled: !!debouncedValue,
    getNextPageParam: (page) => page.hotels.nextPage,
    initialPageParam: 1,
    select: toGroupedData,
  });

  const counts = makeGroupCounts(data, hasNextPage);

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
              {!!data.length && (
                <div className="dropdown-menu w-100 show p-2">
                  <GroupedVirtuoso
                    context={{ loading: isFetchingNextPage }}
                    increaseViewportBy={100}
                    endReached={() => {
                      if (hasNextPage) {
                        fetchNextPage();
                      }
                    }}
                    style={{ height: 300 }}
                    groupCounts={counts}
                    groupContent={(index) => {
                      return (
                        <div>
                          <h2>{['Hotels', 'Countries', 'Cities'][index]}</h2>
                          {!counts[index] && <div>No data found</div>}
                        </div>
                      );
                    }}
                    itemContent={(index, groupIndex) => {
                      return (
                        <a
                          href={`/${['hotel', 'country', 'city'][groupIndex]}/${
                            data[index].id
                          }`}
                          className="dropdown-item"
                        >
                          {data[index].name}
                        </a>
                      );
                    }}
                    components={{ Footer }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Footer: Components<any, { loading: boolean }>['Footer'] = ({
  context,
}) => {
  if (context?.loading) {
    return 'Loading...';
  }
};
