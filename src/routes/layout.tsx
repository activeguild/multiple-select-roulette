import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import styles from "./layout.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <main>
      <section>
        <Slot />
      </section>
    </main>
  );
});
