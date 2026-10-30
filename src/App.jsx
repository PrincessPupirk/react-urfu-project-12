import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AppLayout from './routes/AppLayout.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

function App({ socket }) {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <HomePage socket={socket} />
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
