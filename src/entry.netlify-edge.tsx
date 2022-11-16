import type { Context } from "@netlify/edge-functions";
import { qwikCity } from "@builder.io/qwik-city/middleware/netlify-edge";
import render from "./entry.ssr";

const qwikCityHandler = (request: Request, context: Context) => {
  const lang = () => {
    if (context.geo.country && context.geo.country.code === "JP") {
      return "ja";
    }

    return "en";
  };

  return qwikCity(render, { containerAttributes: { lang: lang() } })(
    request,
    context
  );
};

export default qwikCityHandler;
