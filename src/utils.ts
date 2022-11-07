type Item = {
  text: string;
  color: string;
};

const PALETTE = [
  "#87ceeb",
  "#00e7f3",
  "#00f9b1",
  "#00ff00",
  "#90ff00",
  "#ceff00",
  "#ffff00",
  "#ffc000",
  "#ff7b00",
  "#ff0000",
];

export const extractItems = (text: string): Item[] => {
  const splittiedItems = text.split(/\r\n|\n/);

  return splittiedItems.reduce<Item[]>((curr, item, index) => {
    if (item) {
      return [...curr, { text: item, color: PALETTE[index % 10] }];
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
