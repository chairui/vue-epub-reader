export default function getDrawerNewPosition(): {
  left: number;
  top: number;
  height: number;
} {
  let clientWidth = 0;
  let clientHeight = 0;
  let x = 0;
  let y = 0;
  let left = 0;

  const el = document.getElementById("reader-wrapper");
  if (el) {
    clientWidth = el.clientWidth;
    clientHeight = el.clientHeight;
    const oRect = el.getBoundingClientRect();
    x = oRect?.left;
    y = oRect?.top;
    if (x) {
      left = x;
    }
    left += clientWidth - 440;
  }

  return {
    left: left,
    top: y,
    height: clientHeight,
  };
}
