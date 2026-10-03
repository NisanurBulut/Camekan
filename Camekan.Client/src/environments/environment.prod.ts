import { stripePublishableKey } from './stripe-key';

export const environment = {
  production: true,
  apiUrl: 'http://localhost:63484/api',
  apiKey: stripePublishableKey
};
