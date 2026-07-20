import { test, expect } from '@playwright/test';

test('Prueba básica de API GET', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body.id).toBe(1);
});
