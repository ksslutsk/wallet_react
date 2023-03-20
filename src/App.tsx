import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { MainPage, ReportsPage, SignInPage } from './pages/index';
import { Header } from './shared/components/index';
import { PrivateRoute, STORAGE_USER_KEY, UserContext, UserData } from './shared/libs';
import { refreshUserRequest } from './shared/requests';

interface RefreshUserResponse {
  access_token: string,
  refresh_roken: string
}

const refreshUser = async (user: UserData) => {
  const options: RequestInit = {
    method: "POST",
    headers: { 'Authorization': `Bearer ${user.refresh_token}` }
  }

  const refreshResponse = await refreshUserRequest(options);

  if (refreshResponse.ok) {
    const respData: RefreshUserResponse = await refreshResponse.json();
    const updatedUser: UserData = { ...user, ...respData };

    localStorage[STORAGE_USER_KEY] = JSON.stringify(updatedUser)
  }

  return refreshResponse;
}

export const { fetch: originalFetch } = window;
window.fetch = async (...props) => {
  const [resource, config] = props;

  const response = await originalFetch(resource, config);

  const user: UserData = JSON.parse(localStorage[STORAGE_USER_KEY] ?? '{}');

  if (response.status === 401 && user.access_token) {
    const refreshResponse = await refreshUser(user);

    if (refreshResponse.ok) {
      const repeatedResponse = await originalFetch(resource, config);

      return repeatedResponse;
    }
  }

  return response;
}

function App() {

  const { user, isLogined } = useContext(UserContext);

  return (
    <div className={styles['App']}>
      <div className={styles['background-div']}></div>
      <header>
        <Header />
      </header>
      <main className={styles['main']}>

        <Routes>
          <Route path='/auth' element={<SignInPage />} />
          <Route path='/main' element={
            <PrivateRoute isLogined={!!isLogined?.()}>
              <MainPage />
            </PrivateRoute>
          } />
          <Route path='' element={<Navigate to='/auth' />} />
          <Route path='reports' element={
            <PrivateRoute isLogined={!!isLogined?.()}>
              <ReportsPage />
            </PrivateRoute>
          } />
          <Route path='*' element={<Navigate to='/main' />} />
        </Routes>
        <Outlet />
      </main>
    </div>
  )
}

export default App
