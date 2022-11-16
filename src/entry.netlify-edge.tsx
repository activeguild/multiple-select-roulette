import type { Context } from "@netlify/edge-functions";
import { qwikCity } from "@builder.io/qwik-city/middleware/netlify-edge";
import render from "./entry.ssr";

const qwikCityHandler = (request: Request, context: Context) => {
  console.log(request);
  console.log(context);
  return qwikCity(render)(request, context);
};

export default qwikCityHandler;
