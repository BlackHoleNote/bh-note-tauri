import { atom, selector } from "recoil";
import { RootFolder } from "./Entity/Note";

export const noteListState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: new RootFolder(), // default value (aka initial value)
});

const charCountState = selector({
  key: "charCountState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const folder = get(noteListState);

    return folder;
  },
});
