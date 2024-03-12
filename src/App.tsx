import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Intro from './pages/Intro';
import { IUser } from './models/user';
import { Dispatch, SetStateAction, createContext, useState } from 'react';
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
  const [user, setUser] = useState<IUser | null>(null);
  const [viewerTarget, setViewerTarget] = useState<IPost>();

  return (
    <AppContext.Provider value={{ user, setUser, setViewerTarget }}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/' element={<Main />} />
          </Route>
          <Route path='/login' element={<Intro />} />
        </Routes>
      </BrowserRouter>
      <ImageViewer target={viewerTarget} />
    </AppContext.Provider>
  );
}

export default App;
