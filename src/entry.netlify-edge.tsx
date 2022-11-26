import type { Context } from "@netlify/edge-functions";
import { createQwikCity } from "@builder.io/qwik-city/middleware/netlify-edge";
import render from "./entry.ssr";
import qwikCityPlan from "@qwik-city-plan";

const qwikCityHandler = (request: Request, context: Context) => {
  const lang = () => {
    if (context.geo.country && context.geo.country.code === "JP") {
      return "ja";
    }

    return "en";
  };

  return createQwikCity({
    render,
    containerAttributes: { lang: lang() },
    qwikCityPlan,
  })(request, context);
};

export default qwikCityHandler;
