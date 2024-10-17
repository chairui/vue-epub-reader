import { NavItem } from "epubjs";

export interface BookInfo {
  title: string;
  toc: NavItem[];
}
// export type BookInfoType = BookInfo;

export interface SearchResult {
  cfi: string;
  excerpt: string;
}

export interface NoteResult {
  cfiRange: string;
  text: string;
}
