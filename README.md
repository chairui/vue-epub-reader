# Epub Reader

Epub Reader is a JavaScript example program developed based on the PC version of WeChat Reading. The core uses epub.js and validates some of its features and methods.

If you need an EPUB reader with high flexibility and customization capabilities and prefer not to depend on third-party components, you can refer to this project.

![image](./docs/images/screen0.png) 


## Features

- [x] Custom theme (Light/Dark)
- [x] Change font-size 
- [x] Change font-family (checks if a font is available)
- [x] Hightlight selection in epub 
- [x] Search in the book 
- [x] Disable context menu 
- [x] Get the book's chapter information
- [x] Get the book's metadata, including the title, cover, and publisher (console log)
- [x] Load local epub file
- [x] Use the keyboard buttons for up/down or left/right to move to the next or previous page
- [x] Display current reading progress (console log)
- [x] Adaptive screen size 


## Development

Requires Node.js version >= `v18.0.0`

Build and run:

```
$ yarn 
$ yarn run dev
```


## Dependencies

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pina
- Mitt
- lodash
- scss


## Links

- [Epub.js v0.3](https://github.com/futurepress/epub.js)
- [Epub documentation](http://epubjs.org/documentation/0.3/)
- [EPUB Canonical Fragment Identifiers](https://idpf.org/epub/linking/cfi/epub-cfi.html)
- [Vue Reader](https://jinhuan138.github.io/vue-reader/)
- [WeChat Reading](https://weread.qq.com/)


## License

Epub Reader is open source software licensed as
[MIT](https://github.com/element-plus/element-plus/blob/master/LICENSE).




