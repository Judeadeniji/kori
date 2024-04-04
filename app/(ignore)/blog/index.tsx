import type { Context } from "hono";

export function GET(c: Context) {
  return c.html(`
    <h1>Blog</h1>
    <p>Welcome to my blog!</p>

    <h2>Posts</h2>
    <ul>
      <li><a href="/blog/first-post">First Post</a></li>
      <li><a href="/blog/second-post">Second Post</a></li>
    </ul>
  `)
}