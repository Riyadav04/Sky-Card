import React, { useEffect, useState } from "react";
import axios from "axios";
import Apis from "../../Apis";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../HeaderPage/Header";
import Footer from "../Footer/Footer";

/* --------------------------------------------
 * Helpers
 * -------------------------------------------- */

const buildServerUrl = (p) => {
  if (!p) return "";
  if (typeof p !== "string") return "";
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("uploads/")) return `${Apis.BASE_URL}/${p}`;
  if (p.startsWith("/")) return `${Apis.BASE_URL}${p}`;
  return `${Apis.BASE_URL}/uploads/${p}`;
};

const normalizeFields = (raw) => {
  if (!raw) return {};
  if (Array.isArray(raw)) {
    const obj = {};
    raw.forEach((item) => {
      if (!item) return;
      const k = item.fieldName || item.name || item.key || Object.keys(item)[0];
      const v =
        item.value !== undefined
          ? item.value
          : item.val !== undefined
          ? item.val
          : item[k];
      if (k != null) obj[String(k)] = v;
    });
    return obj;
  }
  return raw;
};

const getCI = (fieldsObj, ...keys) => {
  if (!fieldsObj) return "";
  const lcMap = {};
  Object.entries(fieldsObj).forEach(([k, v]) => {
    lcMap[k.toLowerCase().trim()] = v;
  });
  for (const key of keys) {
    const lk = key.toLowerCase().trim();
    if (lk in lcMap && lcMap[lk] != null && lcMap[lk] !== "") {
      return lcMap[lk];
    }
  }
  return "";
};

const buildDisplayData = (card) => {
  const f = normalizeFields(card.fields);
  return {
    name:
      card.fullname ||
      getCI(f, "fullname", "full name", "name", "studentname", "student name"),
    email: card.email || getCI(f, "email", "emailid", "mail"),
    phone: card.phone || getCI(f, "phone", "mobile", "contact"),
    jobtitle: card.jobtitle || getCI(f, "jobtitle", "designation"),
    website: card.website || getCI(f, "website", "url"),
    address: card.address || getCI(f, "address", "location"),
    extras: Object.entries(f).filter(([k]) => {
      const lk = k.toLowerCase();
      return ![
        "fullname", "full name", "name", "studentname", "student name",
        "email", "emailid", "mail",
        "phone", "mobile", "contact",
        "jobtitle", "designation",
        "website", "url",
        "address", "location"
      ].includes(lk);
    }),
  };
};

const MyCards = () => {
  const { username: routeUsername } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Please login first!");
        navigate("/sign-in");
        return;
      }

      const res = await axios.get(Apis.GET_MY_CARDS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res.data;
      const list = Array.isArray(payload) ? payload : payload.cards || [];
      setCards(list);
    } catch (error) {
      toast.error("Failed to fetch your cards.");
      // console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${Apis.DELETE_CARD}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Card deleted!");
      fetchCards();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <>
      <Header />

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between max-w-7xl mx-auto mb-6">
          <h2 className="text-3xl font-bold text-teal-700">
            {routeUsername ? `${routeUsername}'s Cards` : "My Created Cards"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg py-2 px-6 mt-4 rounded-full shadow-md transition"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cards.length === 0 ? (
          <p className="text-center text-gray-500">No cards created yet.</p>
        ) : (
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto" style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "50px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px",
  }}>
  {cards.map((card) => {
              const templateImg = buildServerUrl(
                card.templateId?.previewImage || card.templateId?.imageUrl
              );

              const profileImg = card.profilePic
                ? buildServerUrl(
                    card.profilePic.startsWith("/uploads")
                      ? card.profilePic
                      : `/uploads/${card.profilePic}`
                  )
                : "";

              const disp = buildDisplayData(card);

              return (
                <div
                  key={card._id}
                  className="relative h-[320px] w-[550px]  gap-between bg-white border rounded-xl shadow-lg "
                >
                  {templateImg && (
                    <img
                      src={templateImg}
                      alt="Template"
                      className="absolute inset-0 w-full h-full "
                    />
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 py-6">
                    {profileImg && (
                      <img
                        src={profileImg}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow mb-2"
                        onError={(e) =>
                          (e.currentTarget.src = "/images/default-user.png")
                        }
                      />
                    )}
                    <h3 className="text-lg font-bold text-gray-900 break-words">
                      {disp.name || "(No name)"}
                    </h3>
                    {disp.email && <p className="text-sm">{disp.email}</p>}
                    {disp.phone && <p className="text-sm">{disp.phone}</p>}
                    {disp.jobtitle && (
                      <p className="text-sm">{disp.jobtitle}</p>
                    )}
                    {disp.website && (
                      <p className="text-sm break-words">{disp.website}</p>
                    )}
                    {disp.address && (
                      <p className="text-sm break-words">{disp.address}</p>
                    )}
                    {disp.extras.slice(0, 3).map(([k, v]) => (
                      <p key={k} className="text-xs truncate" title={String(v)}>
                        {String(v)}
                      </p>
                    ))}
                    {disp.extras.length > 3 && (
                      <p className="text-xs text-gray-400 mt-1">
                        +{disp.extras.length - 3} more
                      </p>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gray-100 px-4 py-2 flex justify-center gap-3">
                    <Link
                      to={`/edit-card/${card._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(card._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/preview-card/${card._id}`}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 text-sm rounded"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyCards;
