import { component$ } from "@builder.io/qwik";
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import en from "./locale/en.json";
import ja from "./locale/ja.json";

import { I18nProvider } from "./i18nProvider";

type Props = {
  lang: string;
};

export default component$<Props>((props) => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <I18nProvider locale={props.lang === "ja" ? ja : en}>
      <QwikCity>
        <head>
          <meta charSet="utf-8" />
          <RouterHead />
        </head>
        <body lang={props.lang}>
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCity>
    </I18nProvider>
  );
});
