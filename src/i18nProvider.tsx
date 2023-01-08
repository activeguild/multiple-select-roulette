import {
  component$,
  createContext,
  useContextProvider,
  useStore,
  Slot,
} from "@builder.io/qwik";

import en from "./locale/en.json";

export type i18nState = {
  locale: typeof en;
};

type Props = {
  locale: typeof en;
};

export const i18nContext = createContext<i18nState>("i18nContext");

export const I18nProvider = component$<Props>((props) => {
  const state = useStore<i18nState>({
    locale: props.locale,
  });

  useContextProvider(i18nContext, state);
  return <Slot />;
});
