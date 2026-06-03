export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html for root
    if (path === "/") path = "/index.html";

    // Add .html extension for clean URLs (no dot = no file extension)
    if (!path.includes(".")) path = path + ".html";

    // Build a new request with the resolved path
    const target = new URL(path + url.search, url.origin);
    const newReq = new Request(target, request);

    try {
      const response = await env.ASSETS.fetch(newReq);
      if (response.status === 404) {
        return env.ASSETS.fetch(new URL("/index.html", url.origin));
      }
      return response;
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
