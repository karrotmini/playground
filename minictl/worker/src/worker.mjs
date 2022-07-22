export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const route = `${request.method.toUpperCase()} ${url.pathname}`;
    switch (route) {
      case 'GET /management_key': {
        return new Response(env.MANAGEMENT_KEY, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
      default: {
        return new Response('Operation not permitted', {
          status: 400,
        });
      }
    }
  },
};
