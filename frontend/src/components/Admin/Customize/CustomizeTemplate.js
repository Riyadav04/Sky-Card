import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar.js";
import CanvasMoveable from "./CanvasMoveable";
import Apis from "../../../Apis";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

const CustomizeTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const GRID = 5; 


  const tokenRef = useRef(localStorage.getItem("token"));

  // Fetch template
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${Apis.ADMIN_GET_TEMPLATE_BY_ID}${id}`);
        if (!res.data) return alert("Template not found");
        setTemplate(res.data);
        if (res.data.fields) {
          setElements(
            res.data.fields.map((f, idx) => ({
              id: f.id || Date.now() + idx,
              type: f.type || "text",
              fieldName: f.fieldName || `field_${idx}`,
              position: {
                x: f.position?.x ?? 10,
                y: f.position?.y ?? 10,
                width: f.position?.width ?? 20,
                height: f.position?.height ?? 10,
                rotate: f.position?.rotate ?? 0,
              },
              style: {
                color: f.style?.color || "#000",
                fontSize: f.style?.fontSize || "14px",
                fontWeight: f.style?.fontWeight || "normal",
                textAlign: f.style?.textAlign || "center",
                zIndex: f.style?.zIndex || (idx + 1),
              },
            }))
          );
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load template.");
      }
    })();
  }, [id]);

  // Unsaved changes guard
  useEffect(() => {
    const beforeUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const handleAdd = (type) => {
    const newElem = {
      id: Date.now(),
      type,
      fieldName: type === "image" ? "Image" : "Text",
      position: { x: 10, y: 10, width: type === "image" ? 18 : 22, height: 10, rotate: 0 },
      style: {
        color: "#000",
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "center",
        zIndex: elements.length + 1,
      },
    };
    setElements((prev) => [...prev, newElem]);
    setSelectedId(newElem.id);
    setDirty(true);
  };

  const updateElement = (id, updater) => {
    if (updater.delete) {
      removeElement(id);
      return;
    }
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              ...updater,
              position: {
                ...el.position,
                ...(updater.position || {}),
              },
              style: {
                ...el.style,
                ...(updater.style || {}),
              },
            }
          : el
      )
    );
    setDirty(true);
  };

  const removeElement = (id) => {
    const el = elements.find((e) => e.id === id);
    if (el) setLastDeleted(el);
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
    setDirty(true);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    setElements((prev) => [...prev, lastDeleted]);
    setLastDeleted(null);
    setDirty(true);
  };

  // Layer controls
  const bringForward = (id) => {
    setElements((prev) => {
      const sorted = [...prev].sort(
        (a, b) => (a.style?.zIndex || 0) - (b.style?.zIndex || 0)
      );
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx === -1 || idx === sorted.length - 1) return prev;
      [sorted[idx].style.zIndex, sorted[idx + 1].style.zIndex] = [
        sorted[idx + 1].style.zIndex,
        sorted[idx].style.zIndex,
      ];
      return [...sorted];
    });
    setDirty(true);
  };

  const sendBackward = (id) => {
    setElements((prev) => {
      const sorted = [...prev].sort(
        (a, b) => (a.style?.zIndex || 0) - (b.style?.zIndex || 0)
      );
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx <= 0) return prev;
      [sorted[idx].style.zIndex, sorted[idx - 1].style.zIndex] = [
        sorted[idx - 1].style.zIndex,
        sorted[idx].style.zIndex,
      ];
      return [...sorted];
    });
    setDirty(true);
  };

  const validateBeforeSave = () => {
    const empty = elements.filter((e) => !e.fieldName?.trim());
    if (empty.length) {
      alert("Some elements have empty field names. Please fix before saving.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!template) return;
    if (!validateBeforeSave()) return;

    const payload = {
      category: template.category,
      previewImage: template.previewImage,
      fields: elements.map((el) => ({
        id: el.id,
        type: el.type,
        fieldName: el.fieldName.trim(),
        position: {
          x: +el.position.x.toFixed(2),
          y: +el.position.y.toFixed(2),
          width: +el.position.width.toFixed(2),
          height: +el.position.height.toFixed(2),
          rotate: +(el.position.rotate || 0).toFixed(2),
        },
        style: {
          color: el.style.color,
          fontSize: el.style.fontSize,
          fontWeight: el.style.fontWeight,
          textAlign: el.style.textAlign,
          zIndex: el.style.zIndex,
        },
      })),
    };

    try {
      await axios.put(
        `${Apis.ADMIN_UPDATE_TEMPLATE}${template._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${tokenRef.current}` },
        }
      );
      alert("Template saved!");
      setDirty(false);
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(
      {
        category: template?.category,
        previewImage: template?.previewImage,
        fields: elements,
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${template?.category || "template"}-layout.json`;
    a.click();
  };

  if (!template)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading template...</p>
      </div>
    );

  const selectedElement = elements.find((e) => e.id === selectedId) || null;

  return (
    <div className="flex min-h-screen bg-[#F0FFFF] text-gray-800">
      <AdminSidebar />

      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          Customize Template – {template.category}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <Sidebar
              onAdd={handleAdd}
              selectedElement={selectedElement}
              updateElement={updateElement}
              removeElement={removeElement}
              bringForward={bringForward}
              sendBackward={sendBackward}
              undoDelete={undoDelete}
              canUndo={!!lastDeleted}
              canSave={dirty}
              onSave={handleSave}
              exportJSON={exportJSON}
            />
          </div>

            <div className="col-span-1 md:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <CanvasMoveable
                elements={elements}
                setElements={setElements}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                backgroundImage={`http://localhost:5000/${template.previewImage}`}
                onDirtyChange={setDirty}
              />
              <p className="text-xs text-center mt-3 text-gray-500">
                💡 Tip: Arrow keys to nudge (Shift + Arrow = faster). Delete to remove. Snap grid = {GRID}%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTemplate;
