import { Rnd } from "react-rnd";

export default function RndElement({ style, children, onDragStop, onResizeStop }) {
  return (
    <Rnd
      size={{ width: style.width, height: style.height }}
      position={{ x: style.left, y: style.top }}
      onDragStop={(e, d) => onDragStop(d.x, d.y)}
      onResizeStop={(e, direction, ref, delta, position) =>
        onResizeStop(ref.offsetWidth, ref.offsetHeight, position.x, position.y)
      }
      bounds="parent"
    >
      <div style={{ ...style, border: "1px dashed gray", padding: "4px" }}>
        {children}
      </div>
    </Rnd>
  );
}
