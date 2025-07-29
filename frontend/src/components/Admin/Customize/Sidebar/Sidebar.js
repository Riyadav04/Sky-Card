import React, { useState, useEffect } from "react";

const presetTextFields = [
  "Full Name",
  "Email",
  "Phone",
  "Job Title",
  "Website",
  "Address",
  "Company",
  "Tagline",
];

const Sidebar = ({
  onAdd,
  selectedElement,
  updateElement,
  removeElement,
  bringForward,
  sendBackward,
  undoDelete,
  canUndo,
  canSave,
  onSave,
  exportJSON,
}) => {
  const [localFontSize, setLocalFontSize] = useState(
    selectedElement?.style?.fontSize?.replace("px", "") || 14
  );

  useEffect(() => {
    setLocalFontSize(
      selectedElement?.style?.fontSize?.replace("px", "") || 14
    );
  }, [selectedElement]);

  return (
    <div className="editor-sidebar bg-white p-5 rounded-2xl shadow-xl space-y-6 w-full">
      <h2 className="text-xl font-bold text-teal-700 tracking-wide">
        🎨 Editor Panel
      </h2>

      <div className="space-y-3">
        <button
          onClick={() => onAdd("text")}
          className="editor-btn bg-teal-600 hover:bg-teal-700"
        >
          ➕ Add Text
        </button>
        <button
          onClick={() => onAdd("image")}
          className="editor-btn bg-purple-600 hover:bg-purple-700"
        >
          🖼️ Add Image
        </button>
        <button
          disabled={!canUndo}
          onClick={undoDelete}
          className={`editor-btn ${
            canUndo
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-gray-300 cursor-not-allowed text-gray-600"
          }`}
        >
          ↩️ Undo Delete
        </button>
      </div>

      {selectedElement && (
        <div className="pt-4 border-t space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            ✏️ Edit Selected
          </h3>

          <div>
            <label className="editor-label">Field Name</label>
            <input
              type="text"
              value={selectedElement.fieldName}
              onChange={(e) =>
                updateElement(selectedElement.id, {
                  fieldName: e.target.value,
                })
              }
              list="field-presets"
              className="editor-input"
            />
            <datalist id="field-presets">
              {presetTextFields.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          {selectedElement.type === "text" && (
            <>
              <div>
                <label className="editor-label">Font Size (px)</label>
                <input
                  type="number"
                  min={8}
                  max={72}
                  value={localFontSize}
                  onChange={(e) => {
                    setLocalFontSize(e.target.value);
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        fontSize: `${e.target.value}px`,
                      },
                    });
                  }}
                  className="editor-input"
                />
              </div>

              <div>
                <label className="editor-label">Color</label>
                <input
                  type="color"
                  value={selectedElement.style?.color || "#000000"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        color: e.target.value,
                      },
                    })
                  }
                  className="w-full h-12 rounded-lg border cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        fontWeight:
                          selectedElement.style?.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                      },
                    })
                  }
                  className={`flex-1 editor-btn ${
                    selectedElement.style?.fontWeight === "bold"
                      ? "!bg-yellow-600"
                      : "!bg-yellow-500"
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        textAlign: "left",
                      },
                    })
                  }
                  className="flex-1 editor-btn bg-slate-500 hover:bg-slate-600"
                >
                  ⬅︎
                </button>
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        textAlign: "center",
                      },
                    })
                  }
                  className="flex-1 editor-btn bg-slate-500 hover:bg-slate-600"
                >
                  ↔︎
                </button>
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, {
                      style: {
                        ...selectedElement.style,
                        textAlign: "right",
                      },
                    })
                  }
                  className="flex-1 editor-btn bg-slate-500 hover:bg-slate-600"
                >
                  ➝
                </button>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => bringForward(selectedElement.id)}
              className="flex-1 editor-btn bg-indigo-500 hover:bg-indigo-600"
            >
              ⬆ Layer
            </button>
            <button
              onClick={() => sendBackward(selectedElement.id)}
              className="flex-1 editor-btn bg-indigo-500 hover:bg-indigo-600"
            >
              ⬇ Layer
            </button>
          </div>

          <button
            onClick={() => removeElement(selectedElement.id)}
            className="editor-btn bg-red-600 hover:bg-red-700 w-full"
          >
            🗑 Delete
          </button>
        </div>
      )}

      <div className="pt-6 border-t space-y-3">
        <button
          onClick={onSave}
          disabled={!canSave}
          className={`w-full editor-btn ${
            canSave
              ? "bg-teal-600 hover:bg-teal-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          💾 Save Template
        </button>
        <button
          onClick={exportJSON}
          className="w-full editor-btn bg-emerald-600 hover:bg-emerald-700"
        >
          📤 Export JSON
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
