import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ReactQueryProvider } from './providers';
import { Search } from './views/search';
import { Hotel } from './views/hotel';
import { Country } from './views/country';
import { City } from './views/city';

const App = () => {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/country/:id" element={<Country />} />
          <Route path="/city/:id" element={<City />} />
        </Routes>
      </ReactQueryProvider>
    </BrowserRouter>
  );
};

export default App;
