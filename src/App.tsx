import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Intro from './pages/Intro';
import { IUser } from './models/user';
import { Dispatch, SetStateAction, createContext, useState } from 'react';
import AuthLayout from './components/AuthLayout';
import Main from './pages/Main';

type AppContextType = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/' element={<Main />} />
          </Route>
          <Route path='/login' element={<Intro />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
