import {
  component$,
  $,
  useSignal,
  useStore,
  useStyles$,
  useServerMount$,
  useClientEffect$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import styles from "./index.css?inline";
import { Share } from "../components/icons/share";
import { extractItems, sleep } from "../utils";
import { JSXNode } from "@builder.io/qwik/jsx-runtime";

type State = {
  title: string;
  items: { text: string }[];
  itemsText: string;
  targets: {
    text: string;
    color: string;
  }[];
  selectIndex: number[];
  selectCount: number;
  stopping: boolean;
  finished: boolean;
};

export default component$(() => {
  useStyles$(styles);

  const state = useStore<State>({
    title: "Next items",
    items: [],
    itemsText: "",
    targets: [],
    selectIndex: [],
    selectCount: 2,
    stopping: false,
    finished: false,
  });
  const refRoulette = useSignal<HTMLDivElement>();
  const refInterval = useSignal<number>();
  const refInterval2 = useSignal<number>();
  const refItems = useSignal<HTMLTextAreaElement>();
  const loc = useLocation();

  const handleTurnClick = $(async () => {
    if (state.stopping) {
      return;
    }
    const interval = () => {
      state.selectIndex = [];
      while (state.selectIndex.length < state.selectCount) {
        const selectIndex = Math.floor(Math.random() * state.targets.length);
        if (!state.selectIndex.includes(selectIndex)) {
          state.selectIndex.push(selectIndex);
        }
      }
    };

    if (!refInterval.value) {
      refInterval.value = window.setInterval(interval, 200);
    } else if (refInterval.value && !refInterval2.value) {
      state.stopping = true;
      clearInterval(refInterval.value);
      refInterval.value = undefined;
      refInterval2.value = window.setInterval(interval, 700);

      await sleep(3000);
      clearInterval(refInterval2.value);
      refInterval2.value = undefined;

      await Promise.all(
        Array.from(document.querySelectorAll(".highlight").values()).map(
          async (elm) => {
            elm.classList.add("flash");
            await sleep(3000);
            elm.classList.remove("flash");
            return elm;
          }
        )
      );

      state.stopping = false;
      state.finished = true;
    }
  });

  const handleTitleChange = $((event: any) => {
    state.title = (event.target as HTMLInputElement).value;
  });

  const handleShareClick = $(async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}?items=${encodeURIComponent(
        state.itemsText
      )}&counts=${state.selectCount}&title=${state.title}`
    );
    window.alert("copied");
  });

  const handleChoicedCountChange = $((event: any) => {
    state.selectCount = parseInt((event.target as HTMLInputElement).value);
  });

  const handleitemsChange = $((event: any) => {
    state.itemsText = (event.target as HTMLTextAreaElement).value;
    state.targets = extractItems(state.itemsText);
  });

  useServerMount$(() => {
    if (loc.query.items) {
      state.itemsText = loc.query.items;
    } else {
      state.itemsText = "1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10";
    }
    if (loc.query.counts) {
      state.selectCount = Number(loc.query.counts);
    } else {
      state.selectCount = 2;
    }
    if (loc.query.title) {
      state.title = loc.query.title;
    } else {
      state.title = "Next items";
    }
  });

  useClientEffect$(() => {
    state.targets = extractItems(state.itemsText);

    // [Note] On the client side, text area values are not reflected.
    if (refItems.value) {
      refItems.value.value = state.itemsText;
    }

    const handleDocumentClick = () => {
      state.finished = false;
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  const renderResult = (): JSXNode | undefined => {
    if (!state.finished || state.selectIndex.length === 0) {
      return undefined;
    }

    return (
      <div class="result">
        <h2 class="result__title">{state.title}</h2>
        {state.targets.map<JSXNode | undefined>((target, index) =>
          state.selectIndex.includes(index) ? (
            <p class="result__item">{target.text}</p>
          ) : undefined
        )}
      </div>
    );
  };

  return (
    <div id="app">
      <aside>
        <p class="description">
          A roulette allows multiple items to be selected.
        </p>
        <div class="frame">
          <button class="share" onClick$={handleShareClick}>
            <Share />
          </button>
          <div class="row">
            <label for="title">Title</label>
            <input
              id="title"
              type="text"
              value={state.title}
              onChange$={handleTitleChange}
            />
          </div>
          <div class="textarea">
            <label for="items">Items</label>
            <textarea
              id="items"
              ref={refItems}
              cols={30}
              rows={8}
              onChange$={handleitemsChange}
              placeholder={"Please type in a newline delimiter."}
            ></textarea>
          </div>
          <div class="row">
            <label for="selectCount">Select count</label>
            <input
              id="selectCount"
              type="number"
              value={state.selectCount}
              onChange$={handleChoicedCountChange}
            />
          </div>
        </div>
      </aside>
      <article>
        <div class="title">{state.title}</div>
        <div class="content" ref={refRoulette}>
          <div class="sector__wrapper">
            {state.targets.map((target, index) => (
              <div
                class={{
                  sector: true,
                  highlight: state.selectIndex.includes(index),
                }}
                style={`transform: rotate(${
                  0.25 -
                  1 / state.targets.length / 2 -
                  index * (1 / state.targets.length)
                }turn) skew(${
                  90 - 360 / state.targets.length
                }deg);background-color: ${target.color}`}
              ></div>
            ))}
          </div>
          <button class="controller" role="button" onClick$={handleTurnClick}>
            <h6 class="controller__label">
              {refInterval.value || state.stopping ? "STOP" : "START"}
            </h6>
          </button>
          <div class="label__wrapper">
            {state.targets.map((target, index) => (
              <div
                class="label"
                style={`transform: translateX(-50%) rotate(${
                  -index * (1 / state.targets.length)
                }turn)`}
              >
                <h2 class="text">{target.text}</h2>
              </div>
            ))}
          </div>
          {renderResult()}
        </div>
      </article>
    </div>
  );
});
