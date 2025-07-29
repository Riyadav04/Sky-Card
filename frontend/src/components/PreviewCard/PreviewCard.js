import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "axios";
import Apis from "../../Apis.js";
import Header from "../HeaderPage/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import "./PreviewCard.css";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { FaLink } from "react-icons/fa";

/* --------------------------------------------------
 * CONFIG / CONSTANTS
 * -------------------------------------------------- */
const IMAGE_KEYS = [
  "image",
  "photo",
  "logo",
  "picture",
  "avatar",
  "profile",
  "icon",
];

/**
 * Templates that prefer the "avatar + 2-column" layout **when an image value exists**.
 * NOTE: Added the ID you just gave me ("868be7ed973aa5fec6b0dc5") + the earlier 3.
 */
const TWO_COL_TEMPLATE_IDS = [
  "6868be7ed973aa5fec6b0dc5",
  "686b93e39e42d7b22005f3ca",
  "6868a9d7d973aa5fec6b0d2a",
  "868be7ed973aa5fec6b0dc5",
];

const IMAGE_SIZE_PX = 90; // avatar width/height
const IMAGE_MARGIN_BELOW_PX = 12; // gap between avatar & text grid

/* --------------------------------------------------
 * HELPERS
 * -------------------------------------------------- */
const isProbableImageField = (fieldObj) => {
  if (fieldObj.type && fieldObj.type.toLowerCase() === "image") return true;
  const name = fieldObj.fieldName?.toLowerCase() || "";
  return IMAGE_KEYS.some((k) => name.includes(k));
};

const buildServerUrl = (p) => {
  if (!p) return "";
  if (typeof p !== "string") return "";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return `${Apis.BASE_URL}${p}`;
  return `${Apis.BASE_URL}/${p}`;
};

/* --------------------------------------------------
 * COMPONENT
 * -------------------------------------------------- */
const PreviewCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cardId } = useParams();

  // If we arrived via FillForm -> location.state will contain template + userData (NOT saved yet!)
  // If we arrived via a shared/public URL (/card/:id or /preview/:id with no state) -> we must fetch from server.
  const cameFromForm = Boolean(
    location.state && location.state.selectedCard && location.state.userData
  );
  const isPublicRoute = location.pathname.startsWith("/card"); // adjust if your public route differs

  const [selectedCard, setSelectedCard] = React.useState(
    location.state?.selectedCard || null
  );
  const [userData, setUserData] = React.useState(
    location.state?.userData || null
  );
  const [error, setError] = React.useState(null);
  const [previewURLs, setPreviewURLs] = React.useState({});
  const [savedCardId, setSavedCardId] = React.useState(null); // capture id returned from server after save
  const [isSaving, setIsSaving] = React.useState(false);

  // Share URL logic:
  // - If card is saved (either we loaded from server or we just saved), share actual public URL (/card/:id)
  // - Else (preview-only) disable share until saved.
  const effectiveCardId = savedCardId || (!cameFromForm ? cardId : null);
 const shareUrl = effectiveCardId
  ? `${window.location.origin}/card/${effectiveCardId}`
  : null;
 // no shareable link until saved

  /* ---------------- Load from API when needed ---------------- */
  React.useEffect(() => {
    if (cameFromForm) return; // we already have template + user data from state
    if (!cardId) return; // nothing to fetch

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${Apis.GET_CARD_BY_ID}/${cardId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
          console.log(token);
        // Expecting server to return { card, userData } OR { card: {...}, data: {...} }
        const srvCard = res.data.card || res.data.template || null;
        const srvUserData = res.data.userData || res.data.data || null;
        if (!srvCard) throw new Error("Server did not return card template.");
        setSelectedCard(srvCard);
        setUserData(srvUserData);
      } catch (err) {
        console.error("Fetch card error:", err?.response?.data || err);
        setError("Failed to fetch card data.");
      }
    })();
  }, [cameFromForm, cardId]);

  /* ---------------- Build preview object URLs for File images ---------------- */
  React.useEffect(() => {
    if (!userData) return;
    // revoke old
    Object.values(previewURLs).forEach((u) => URL.revokeObjectURL(u));
    const fresh = {};
    Object.entries(userData).forEach(([k, v]) => {
      if (v instanceof File && v.type.startsWith("image/")) {
        fresh[k] = URL.createObjectURL(v);
      }
    });
    setPreviewURLs(fresh);
    return () => {
      Object.values(fresh).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const getUserValue = (fieldName) =>
    userData && fieldName in userData ? userData[fieldName] : "";


// const handleSaveCard = async () => {
//   if (!userData || !selectedCard) {
//     toast.error("No card data to save.");
//     return;
//   }

//   setIsSaving(true);
//   try {
//     const token = localStorage.getItem("token");
//     const formData = new FormData();

//     let profilePicFile = null;
//     const dyn = {};

//     Object.entries(userData).forEach(([k, v]) => {
//       if (!profilePicFile && v instanceof File && v.type.startsWith("image/")) {
//         profilePicFile = v;
//       } else {
//         dyn[k] = v instanceof File ? v.name : v ?? "";
//       }
//     });

//     if (profilePicFile) {
//       formData.append("profilePic", profilePicFile, profilePicFile.name);
//     }

//     formData.append("templateId", selectedCard.templateId || selectedCard._id);
//     formData.append("data", JSON.stringify(dyn));

//     const res = await axios.post(Apis.CREATE_CARD, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//     });

//     console.log("Create card response: ", res.data); // DEBUG
//     toast.success("Card saved successfully!");

//     const newId = res.data?.card?._id || res.data?.cardId || res.data?._id;
//     navigate("/my-cards");
//   } catch (err) {
//     console.error("Save card error:", err?.response?.data || err);
//     toast.error("Failed to save card.");
//   } finally {
//     setIsSaving(false);
//   }
// };




  const handleDownload = async () => {
    const cardElement = document.getElementById("card-preview");
    if (!cardElement) return;
    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "digital-card.png";
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download image.");
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast.info("Please save the card first to generate a shareable link.");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Card link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  
  if (!selectedCard || !userData) {
    return (
      <>
        <Header />
        <div className="p-8 text-center text-red-600 font-medium">
          No card or user data found. Please go back and try again.
        </div>
        <Footer />
      </>
    );
  }

  /* ----------------layout ---------------- */
  const templateIdForLayout = selectedCard.templateId || selectedCard._id;
  const useTwoColLayout = TWO_COL_TEMPLATE_IDS.includes(templateIdForLayout);


  const allFields = selectedCard.fields || [];
  const imageFields = allFields.filter((f) => isProbableImageField(f));
  const textFields = allFields.filter((f) => !isProbableImageField(f));

  const primaryImageField = imageFields[0] || null;
  const resolveImageSrc = (field) => {
    const rawVal = getUserValue(field.fieldName);
    if (!rawVal) return null;
    if (rawVal instanceof File) {
      return previewURLs[field.fieldName];
    }
    if (typeof rawVal === "string") {
      const trimmed = rawVal.trim().toLowerCase();
      if (
        !trimmed ||
        trimmed === "null" ||
        trimmed === "undefined" ||
        trimmed === "none"
      )
        return null;
      return buildServerUrl(rawVal);
    }
    return null;
  };

  const primaryImageSrc = primaryImageField
    ? resolveImageSrc(primaryImageField)
    : null;
  const hasPrimaryImage = Boolean(primaryImageSrc);

  // Split text into groups (for 2-col)
  const mid = Math.ceil(textFields.length / 2);
  const textGroupA = textFields.slice(0, mid);
  const textGroupB = textFields.slice(mid);

  const backgroundImgUrl = buildServerUrl(selectedCard.previewImage);

  /* --------------------------------------------------
   * Render helpers
   * -------------------------------------------------- */
  const renderTextLine = (field, key) => {
    const rawVal = getUserValue(field.fieldName);
    if (!rawVal) return null;
    const text = rawVal instanceof File ? rawVal.name : rawVal;
    return (
      <div
        key={key}
        style={{
          marginBottom: "2px",
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {text}
      </div>
    );
  };

  const renderNoImageLayout = () => (
    <div
      style={{
        position: "absolute",
        left: "5%",
        top: "5%",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        color: "#000",
        fontSize: "15px",
        lineHeight: "1.8",
        textAlign: "left",
      }}
    >
      {textFields.map((f, i) => renderTextLine(f, `txt-${i}`))}
    </div>
  );

  /* --------------------------------------------------
   * RENDER
   * -------------------------------------------------- */
  return (
    <>
      <Header />

      <button
        onClick={() => navigate(-1)}
        className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg py-2 px-6 mt-4 rounded-full shadow-md transition ml-4"
      >
        ← Back
      </button>

      <div className="preview-container mt-2">
        <h1 className="main-title">Your Card Preview</h1>
        <p className="sub-title">
          Here's how your digital business card will look
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="card-preview">
          <div
            id="card-preview"
            className="template-background"
            style={{
              backgroundImage: `url(${backgroundImgUrl})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "relative",
              borderRadius: "12px",
              padding: "20px",
              boxSizing: "border-box",
              minHeight: "250px",
            }}
          >
            {useTwoColLayout ? (
              hasPrimaryImage ? (
                <>
                  <img
                    src={primaryImageSrc}
                    alt={primaryImageField.fieldName}
                    style={{
                      position: "absolute",
                      left: "5%",
                      top: "5%",
                      width: `${IMAGE_SIZE_PX}px`,
                      height: `${IMAGE_SIZE_PX}px`,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ccc",
                    }}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-user.png";
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "5%",
                      top: `calc(5% + ${IMAGE_SIZE_PX}px + ${IMAGE_MARGIN_BELOW_PX}px)`,
                      width: "90%",
                      display: "grid",
                      gridTemplateColumns:
                        textGroupB.length > 0 ? "1fr 1fr" : "1fr",
                      columnGap: "5px",
                      rowGap: "5px",
                      color: "#000",
                      fontSize: "15px",
                      lineHeight: "1.7",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      {textGroupA.map((f, i) => renderTextLine(f, `txtA-${i}`))}
                    </div>
                    {textGroupB.length > 0 && (
                      <div>
                        {textGroupB.map((f, i) =>
                          renderTextLine(f, `txtB-${i}`)
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                renderNoImageLayout()
              )
            ) : (
              // Non two-column templates fall back to absolute placements from template config
              selectedCard.fields?.map((field, index) => {
                const rawVal = getUserValue(field.fieldName);
                if (!rawVal) return null;

                const looksLikeImageField = isProbableImageField(field);
                let imageSrc = null;
                if (
                  rawVal instanceof File &&
                  rawVal.type.startsWith("image/")
                ) {
                  imageSrc = previewURLs[field.fieldName];
                } else if (looksLikeImageField && typeof rawVal === "string") {
                  imageSrc = buildServerUrl(rawVal);
                }

                const style = {
                  ...field.style,
                  position: "absolute",
                  left: `${field.position?.x || 0}%`,
                  top: `${field.position?.y || 0}%`,
                  width:
                    field.position?.width != null
                      ? `${field.position.width}%`
                      : "auto",
                  height:
                    field.position?.height != null
                      ? `${field.position.height}%`
                      : "auto",
                  padding: "3px",
                  textAlign: field.style?.textAlign || "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                };

                if (imageSrc) {
                  return (
                    <img
                      key={index}
                      src={imageSrc}
                      alt={field.fieldName}
                      style={{
                        ...style,
                        objectFit: "cover",
                        borderRadius: field.style?.borderRadius || "50%",
                      }}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = "/images/default-user.png";
                      }}
                    />
                  );
                }

                return (
                  <div key={index} style={style}>
                    {rawVal instanceof File ? rawVal.name : rawVal}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleDownload} className="gradient-btn">
            Download Card
          </button>
          {/* <button
            onClick={handleSaveCard}
            className="outline-btn"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Card"}
          </button> */}
        </div>

        {/* Social share buttons aligned to the right */}
        <div className="flex gap-3 mt-4 justify-end">
          <FacebookShareButton
            url={shareUrl || window.location.href}
            quote="Check out my digital card!"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <WhatsappShareButton
            url={shareUrl || window.location.href}
            title="Check out my digital card!"
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <TwitterShareButton
            url={shareUrl || window.location.href}
            title="Check out my digital card!"
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton
            url={shareUrl || window.location.href}
            title="Check out my digital card!"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full shadow transition"
            title={
              !shareUrl ? "Save the card first to enable sharing" : "Copy link"
            }
          >
            <FaLink /> {shareUrl ? "Copy Link" : "Save first"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PreviewCard;
