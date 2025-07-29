import React, { useEffect, useRef, useState, useCallback } from "react";
import Moveable from "react-moveable";

/**
 * ELEMENT SHAPE (state me):
 * {
 *   id,
 *   type: 'text' | 'image',
 *   fieldName: string,
 *   position: { x: % , y: % , width: % , height: % },
 *   style: { fontSize, color, fontWeight, textAlign, zIndex }
 * }
 */

const GRID_PERCENT = 5;

const pct = (value) => parseFloat(Number(value).toFixed(2));

const CanvasMoveable = ({
  elements,
  setElements,
  selectedId,
  setSelectedId,
  backgroundImage,
  onDirtyChange,
}) => {
  const containerRef = useRef(null);
  const targetRef = useRef(null);                 // DOM node of selected
  const moveableRef = useRef(null);
  const liveDraftRef = useRef({});                // direct mutable draft

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // ---------------- Container Size ----------------
  const measure = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ---------------- Selection Target ----------------
  useEffect(() => {
    if (selectedId) {
      const el = document.getElementById(`element-${selectedId}`);
      targetRef.current = el || null;
    } else {
      targetRef.current = null;
    }
  }, [selectedId, elements]);

  // ---------------- Outside Click Unselect ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setSelectedId]);

  // ---------------- Keyboard Nudge / Delete ----------------
  useEffect(() => {
    const handler = (e) => {
      if (!selectedId) return;
      const el = elements.find((f) => f.id === selectedId);
      if (!el) return;
      let { x, y, width, height } = el.position;
      const step = e.shiftKey ? 2 : 0.5;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") y -= step;
        if (e.key === "ArrowDown") y += step;
        if (e.key === "ArrowLeft") x -= step;
        if (e.key === "ArrowRight") x += step;
        x = Math.min(Math.max(x, 0), 100 - width);
        y = Math.min(Math.max(y, 0), 100 - height);
        updateElementPercent(selectedId, { x, y });
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeElement(selectedId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, elements]);

  // ---------------- Helper: Update in percent (final) ----------------
  const markDirty = () => onDirtyChange && onDirtyChange(true);

  const updateElementPercent = (id, partialPos) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              position: {
                ...el.position,
                ...Object.fromEntries(
                  Object.entries(partialPos).map(([k, v]) => [k, pct(v)])
                ),
              },
            }
          : el
      )
    );
    markDirty();
  };

  const updateFieldName = (id, name) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, fieldName: name } : el))
    );
    markDirty();
  };

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
    markDirty();
  };

  // ---------------- Drag / Resize Logic (DOM live) ----------------
  const onDrag = ({ left, top, target }) => {
    // DOM ko live update karo (px)
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
  };

  const onDragEnd = ({ target }) => {
    if (!containerRef.current || !selectedId) return;
    const parent = containerRef.current.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    const xPct = ((rect.left - parent.left) / parent.width) * 100;
    const yPct = ((rect.top - parent.top) / parent.height) * 100;
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;
    updateElementPercent(selectedId, {
      x: Math.min(Math.max(xPct, 0), 100 - el.position.width),
      y: Math.min(Math.max(yPct, 0), 100 - el.position.height),
    });
  };

  const onResize = ({ width, height, drag, target }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.left = `${drag.left}px`;
    target.style.top = `${drag.top}px`;
  };

  const onResizeEnd = ({ target }) => {
    if (!containerRef.current || !selectedId) return;
    const parent = containerRef.current.getBoundingClientRect();
    const rect = target.getBoundingClientRect();

    const xPct = ((rect.left - parent.left) / parent.width) * 100;
    const yPct = ((rect.top - parent.top) / parent.height) * 100;
    const wPct = (rect.width / parent.width) * 100;
    const hPct = (rect.height / parent.height) * 100;

    updateElementPercent(selectedId, {
      x: Math.min(Math.max(xPct, 0), 100 - wPct),
      y: Math.min(Math.max(yPct, 0), 100 - hPct),
      width: wPct,
      height: hPct,
    });
  };

  // ---------------- Render util: percent -> px ----------------
  const toPx = (pctVal, total) => (pctVal / 100) * total;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] border border-gray-300 rounded-xl overflow-hidden bg-white shadow-inner select-none"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseDown={(e) => {
        if (e.target === containerRef.current) setSelectedId(null);
      }}
    >
      {containerSize.w > 0 &&
        elements.map((el) => {
          const sel = el.id === selectedId;
            const {
            x = 0,
            y = 0,
            width = 20,
            height = 10,
            rotate = 0,
          } = el.position;

          const leftPx = toPx(x, containerSize.w);
          const topPx = toPx(y, containerSize.h);
          const widthPx = toPx(width, containerSize.w);
          const heightPx = toPx(height, containerSize.h);

          return (
            <div
              key={el.id}
              id={`element-${el.id}`}
              onMouseDown={(e) => {
                e.stopPropagation();
                setSelectedId(el.id);
              }}
              style={{
                position: "absolute",
                left: leftPx,
                top: topPx,
                width: widthPx,
                height: heightPx,
                transform: `rotate(${rotate}deg)`,
                fontSize: el.style?.fontSize || "14px",
                fontWeight: el.style?.fontWeight || "normal",
                color: el.style?.color || "#111",
                textAlign: el.style?.textAlign || "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  el.type === "image" ? "#f1f5f9" : "rgba(255,255,255,0.0)",
                border: sel ? "1px dashed #0d9488" : "1px dashed transparent",
                borderRadius: el.type === "image" ? "50%" : "6px",
                cursor: sel ? "move" : "pointer",
                overflow: "hidden",
                zIndex: el.style?.zIndex || 1,
                userSelect: "none",
                boxSizing: "border-box",
                padding: el.type === "text" ? "2px 4px" : 0,
              }}
            >
              {el.type === "image" ? (
                <span
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    pointerEvents: "none",
                  }}
                >
                  {el.fieldName || "Image"}
                </span>
              ) : sel ? (
                <input
                  value={el.fieldName}
                  onChange={(e) => updateFieldName(el.id, e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    color: "inherit",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              ) : (
                <span style={{ pointerEvents: "none" }}>{el.fieldName}</span>
              )}

              {sel && (
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(el.id);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow"
                  title="Delete"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

      {selectedId && targetRef.current && (
        <Moveable
          ref={moveableRef}
          target={targetRef.current}
          container={containerRef.current}
          origin={false}
          draggable
          resizable
          rotatable={false}              /* rotation off for stability first */
          snappable
          snapGap
          snapThreshold={8}
          elementGuidelines={elements
            .filter((el) => el.id !== selectedId)
            .map((el) => document.getElementById(`element-${el.id}`))
            .filter(Boolean)}
          // Grid (convert percent to px)
          {...(() => {
            const gridPxW = (GRID_PERCENT / 100) * containerSize.w;
            const gridPxH = (GRID_PERCENT / 100) * containerSize.h;
            return {
              snapGridWidth: gridPxW,
              snapGridHeight: gridPxH,
            };
          })()}
          bounds={{ left: 0, top: 0, right: 0, bottom: 0 }}
          keepRatio={elements.find((e) => e.id === selectedId)?.type === "image"}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      )}

      {!elements.length && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          Add fields from the left panel to start designing…
        </div>
      )}
    </div>
  );
};

export default CanvasMoveable;
