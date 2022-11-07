import chroma from "chroma-js";

type Item = {
  text: string;
  color: string;
};

export const extractItems = (text: string): Item[] => {
  const splittiedItems = text.split(/\r\n|\n/);

  const pallet = chroma
    .scale(["skyblue", "lime", "yellow", "red"])
    .mode("lch")
    .colors(splittiedItems.length);

  return splittiedItems.reduce<Item[]>((curr, item, index) => {
    if (item) {
      return [...curr, { text: item, color: pallet[index] }];
    }

    return curr;
  }, []);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, ms);
  });
};
