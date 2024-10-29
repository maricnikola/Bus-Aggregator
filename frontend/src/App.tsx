import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Search from './pages/Search';
import NavBar from './components/NavBar';
import CarriersProvidersList from './pages/CarriersProvidersList';
import Departures from './pages/Departures';
import { UserProvider } from './context/UserContext';

import './i18n';
import UserDepartures from './pages/UserDepartures';

const App = () => {
  return (
    <BrowserRouter>
    <UserProvider>
      <NavBar />
      <Routes>
        <Route path='/search' element={<Search />} />
        <Route path='/login' element={<ProtectedRoute><Login/></ProtectedRoute>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/departures' element={<Departures/>}/>
        <Route path='/user-departures' element={<ProtectedRoute><UserDepartures/></ProtectedRoute>}/>
        <Route path='/register' element={<ProtectedRoute><Register/></ProtectedRoute>}/>
        <Route path='/carriers-providers' element={<ProtectedRoute><CarriersProvidersList/></ProtectedRoute>}></Route>
      </Routes>
    </UserProvider>
    </BrowserRouter>
  );
}

export default App;
