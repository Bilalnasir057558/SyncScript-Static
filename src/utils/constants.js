// Application constants

export const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  VAULTS: 'vaults'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard'
};

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_USERNAME_LENGTH: 3
};

export const TINYMCE_CONFIG = {
  API_KEY: 'no-api-key', // Get from https://www.tiny.cloud/ for production
  HEIGHT: 300,
  PLUGINS: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
  ],
  TOOLBAR: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
};