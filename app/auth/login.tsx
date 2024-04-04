import type { Context } from "hono";
import { logger } from "hono/logger";


export const middlewares = [logger()]

function LoginPage(props: { isInvalid?: boolean }) {
  return (
    <div>
      <h1>Login</h1>
      <form method="POST">
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        {props.isInvalid && <p>Invalid email or password</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export async function POST(c: Context) {
  const fd = await c.req.formData();
  const email = fd.get("email");
  const password = fd.get("password");
 
  if (email === "admin@uref.me" && password === "admin") {
    c.set("user", { email });
    return c.redirect("/");

  }

  return c.html(<LoginPage isInvalid />);
}
export function GET(c: Context) {
  return c.html(<LoginPage />);
}