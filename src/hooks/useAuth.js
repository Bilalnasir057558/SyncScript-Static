import { createContext, useContext, useState, createElement } from 'react';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/storage';

const AuthContext = createContext(null);

const createId = (prefix) => `${prefix}-${Date.now()}`;
const createToken = () => `token-${Date.now()}`;
const createTimestamp = () => new Date().toISOString();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getFromStorage('currentUser'));

  const signup = (username, email, password) => {
    const users = getFromStorage('users') || [];

    if (users.find(u => u.email === email || u.username === username)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: createId('user'),
      username,
      email,
      password,
      createdAt: createTimestamp()
    };

    users.push(newUser);
    setToStorage('users', users);

    const session = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: createToken(),
      isLoggedIn: true
    };
    setToStorage('currentUser', session);
    setCurrentUser(session);

    return newUser;
  };

  const login = (email, password) => {
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === email || u.username === email);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: createToken(),
      isLoggedIn: true
    };
    setToStorage('currentUser', session);
    setCurrentUser(session);

    return session;
  };

  const logout = () => {
    removeFromStorage('currentUser');
    setCurrentUser(null);
  };

  return createElement(
    AuthContext.Provider,
    { value: { currentUser, signup, login, logout, isLoggedIn: !!currentUser } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};