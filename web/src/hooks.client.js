/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
  console.error('Client error:', error, event);
}
