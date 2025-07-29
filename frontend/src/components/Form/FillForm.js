import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../Form/FillForm.css";
import Header from "../HeaderPage/Header";

/* --------------------------------------------------
 * Config
 * -------------------------------------------------- */
const FILE_KEYS = ["image", "photo", "logo", "file", "picture"];
const LONG_TEXT_KEYS = ["address", "about", "description", "summary", "bio", "notes"];

/** 
 * Kuch templates par image field *force* dikhani hai chahe category Student ho.
 * Aapne diya: 868be7ed973aa5fec6b0dc5
 * Pehle list me tha: 6868be7ed973aa5fec6b0dc5
 * Dono ko cover kar raha hoon (typo safety).
 */
const FORCE_IMAGE_TEMPLATE_IDS = [
  "868be7ed973aa5fec6b0dc5",
  "6868be7ed973aa5fec6b0dc5",
];

const FillForm = () => {
  const { cardId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // selectedCard may be undefined first render
  const { selectedCard } = location.state || {};

  const [formData, setFormData] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const objectURLsRef = useRef({});

  /* ---------- Helpers ---------- */
  const isFileField = (name = "") =>
    FILE_KEYS.some((k) => name.toLowerCase().includes(k));

  const isLongField = (name = "") =>
    LONG_TEXT_KEYS.some((k) => name.toLowerCase().includes(k));

  /* ---------- Derived values ---------- */
  const allFields = useMemo(
    () => (selectedCard?.fields ? selectedCard.fields : []),
    [selectedCard]
  );

  // Student? (case-insensitive)
  const isStudentCategory = useMemo(() => {
    const catLower = (selectedCard?.category || "").toLowerCase();
    return catLower.includes("student");
  }, [selectedCard]);

  // Template forced image?
  const forceShowImage = useMemo(() => {
    const cid = selectedCard?._id || cardId || "";
    return FORCE_IMAGE_TEMPLATE_IDS.includes(cid);
  }, [selectedCard, cardId]);

  /**
   * Decision: normally Student hides image,
   * but if this template is in FORCE_IMAGE_TEMPLATE_IDS, override and show image.
   */
  const hideImageForStudent = isStudentCategory && !forceShowImage;

  // Fields actually shown in the form
  const visibleFields = useMemo(() => {
    return hideImageForStudent
      ? allFields.filter((f) => !isFileField(f.fieldName))
      : allFields;
  }, [allFields, hideImageForStudent]);

  /* ---------- Cleanup object URLs on unmount ---------- */
  useEffect(() => {
    return () => {
      Object.values(objectURLsRef.current).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  /* ---------- Handlers ---------- */
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (fieldName, file) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }
    if (objectURLsRef.current[fieldName]) {
      URL.revokeObjectURL(objectURLsRef.current[fieldName]);
    }
    const url = URL.createObjectURL(file);
    objectURLsRef.current[fieldName] = url;
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const isEmpty = (fieldName) => {
    const val = formData[fieldName];
    if (isFileField(fieldName)) return !val;
    return !val || (typeof val === "string" && val.trim() === "");
  };

  const validateForm = () => visibleFields.every((f) => !isEmpty(f.fieldName));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;

    // Only send visible fields (skip hidden images for Student unless forced)
    const sendData = {};
    visibleFields.forEach((f) => {
      const k = f.fieldName;
      sendData[k] = formData[k] ?? "";
    });

    if (selectedCard?._id) {
      navigate(`/preview/${selectedCard._id}`, {
        state: { selectedCard, userData: sendData },
      });
    } else {
      // Safety fallback
      navigate(-1);
    }
  };

  const handleReset = () => {
    setFormData({});
    setTouched({});
    setSubmitted(false);
    Object.values(objectURLsRef.current).forEach((u) => URL.revokeObjectURL(u));
    objectURLsRef.current = {};
  };

  /* ---------- Progress ---------- */
  const filledCount = visibleFields.filter((f) => !isEmpty(f.fieldName)).length;
  const percent = visibleFields.length
    ? Math.round((filledCount / visibleFields.length) * 100)
    : 0;

  /* ---------- Render ---------- */
  if (!selectedCard) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen text-lg font-semibold text-red-600">
          No card selected. Please go back and choose a template.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="form-wrapper py-10 px-4">
        <div className="mx-auto max-w-5xl">
          {/* Header Card */}
          <div className="form-header">
            <h1 className="form-title">Fill {selectedCard.category} Details</h1>
            <p className="form-subtitle" style={{ color: "white" }}>
              Please provide accurate information. All fields are required (*).
              You can preview before saving permanently.
            </p>

            {/* Progress Bar */}
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <p className="progress-text" style={{ color: "white" }}>
                {percent}% complete ({filledCount}/{visibleFields.length})
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleFields.map((field, index) => {
                const fieldName = field.fieldName;
                const showError = (submitted || touched[fieldName]) && isEmpty(fieldName);
                const longField = isLongField(fieldName);
                // show file field only if it's a file AND not hidden
                const fileField = isFileField(fieldName) && !hideImageForStudent;

                return (
                  <div
                    key={index}
                    className={`field-group flex flex-col ${longField ? "md:col-span-2" : ""}`}
                  >
                    <label className="field-label" htmlFor={`field-${index}`}>
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    {fileField ? (
                      <>
                        <input
                          id={`field-${index}`}
                          type="file"
                          accept="image/*"
                          className={`input-base cursor-pointer ${
                            showError ? "input-error" : "input-normal"
                          }`}
                          onChange={(e) =>
                            handleFileChange(fieldName, e.target.files?.[0] || null)
                          }
                          onBlur={() => handleBlur(fieldName)}
                        />
                        {formData[fieldName] && (
                          <div className="file-preview">
                            <img
                              src={objectURLsRef.current[fieldName]}
                              alt="preview"
                              className="file-img"
                            />
                            <span className="file-name">{formData[fieldName].name}</span>
                          </div>
                        )}
                      </>
                    ) : longField ? (
                      <textarea
                        id={`field-${index}`}
                        rows={4}
                        className={`input-base resize-y ${
                          showError ? "input-error" : "input-normal"
                        }`}
                        placeholder={`Enter ${fieldName}...`}
                        value={formData[fieldName] || ""}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        onBlur={() => handleBlur(fieldName)}
                      />
                    ) : (
                      <input
                        id={`field-${index}`}
                        type="text"
                        className={`input-base ${
                          showError ? "input-error" : "input-normal"
                        }`}
                        placeholder={`Enter ${fieldName}...`}
                        value={formData[fieldName] || ""}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        onBlur={() => handleBlur(fieldName)}
                      />
                    )}

                    {showError && (
                      <span className="error-text">{fieldName} is required.</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="action-btn secondary"
              >
                Back
              </button>
              <button type="submit" className="action-btn primary">
                Submit & Preview
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="action-btn danger"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FillForm;
