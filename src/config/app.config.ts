export const EnvConfiguration = () => ({
  PORT: process.env.PORT || 8080,
  BASE_URL: process.env.BASE_URL || 'https://swapi.dev/api/',
});
