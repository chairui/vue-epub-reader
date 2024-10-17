/*
import { useReaderStore } from "../../../stores/reader-store";
const readerStore = useReaderStore();

readerStore.xxx   //getters
readerStore.xxx() //actions
*/
import { defineStore } from "pinia";

interface State {
  fontFamily: string;
  fontSize: number;
}

export const useReaderStore = defineStore("useReaderStore", {
  state: (): State => {
    return {
      fontFamily: localStorage.getItem("font-family") || "宋体",
      fontSize: JSON.parse(localStorage.getItem("font-size") || `100`),
    };
  },
  actions: {
    setfontFamily(fontFamily: string) {
      this.fontFamily = fontFamily;
      localStorage.setItem("font-family", fontFamily);
    },
    setFontSize(fontSize: number) {
      this.fontSize = fontSize;
      localStorage.setItem("font-size", JSON.stringify(fontSize));
    },
  },
});
