
import { stripePublishableKey } from './stripe-key';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:63484/api',
  apiKey: stripePublishableKey
};
