import { component$, useServerMount$, useContext } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { i18nContext } from "../../i18nProvider";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const state = useContext(i18nContext);

  useServerMount$(() => {
    head.title = state.locale.title;
  });

  head.meta.push({
    name: "description",
    content: state.locale.desctiption,
  });
  head.meta.push({
    name: "og:description",
    content: state.locale.desctiption,
  });
  head.meta.push({
    name: "og:title",
    content: state.locale.title,
  });
  head.meta.push({
    name: "google-site-verification",
    content: "walavZmPPV72FudHuMJymnIjVEk9_be4G5Lm7Rj2EGI",
  });
  head.meta.push({
    name: "og:url",
    content: "https://multiple-select-roulette.netlify.app/",
  });
  head.meta.push({
    name: "google-site-verification",
    content: "walavZmPPV72FudHuMJymnIjVEk9_be4G5Lm7Rj2EGI",
  });

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
