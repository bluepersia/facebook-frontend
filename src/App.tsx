import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Intro from './pages/Intro';
import { IUser } from './models/user';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import AuthLayout from './components/AuthLayout';
import Main from './pages/Main';
import ImageViewer from './components/ImageViewer';
import { IPost } from './models/post';

type AppContextType = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  setViewerTarget: Dispatch<SetStateAction<IPost | undefined>>;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  setViewerTarget: () => {},
});

function App() {
  const [user, setUser] = useState<IUser | null>(() => {
    const json = localStorage.getItem('user2');
    return json ? JSON.parse(json) : null;
  });
  const [userExpires, setUserExpires] = useState<Date>(() => {
    const json = localStorage.getItem('userExpires2');
    return json ? JSON.parse(json) : new Date(Date.now());
  });
  const [viewerTarget, setViewerTarget] = useState<IPost>();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user2', JSON.stringify(user));
      setUserExpires(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    }
  }, [user]);

  useEffect(() => {
    if (userExpires)
      localStorage.setItem('userExpires2', JSON.stringify(userExpires));
  }, [userExpires]);

  useEffect(() => {
    setInterval(checkUserExpired, 1000);
  }, []);

  function checkUserExpired(): void {
    if (new Date(Date.now()) >= userExpires) setUser(null);
  }

  return (
    <AppContext.Provider value={{ user, setUser, setViewerTarget }}>
      {(viewerTarget && <ImageViewer target={viewerTarget} />) || (
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path='/' element={<Main />} />
            </Route>
            <Route path='/login' element={<Intro />} />
          </Routes>
        </BrowserRouter>
      )}
    </AppContext.Provider>
  );
}

export default App;
