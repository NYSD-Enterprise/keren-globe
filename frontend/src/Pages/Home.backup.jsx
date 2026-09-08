import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/Api";

function Home() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  const [showDestinations, setShowDestinations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // GET DESTINATIONS
  // =========================
  const exploreDestinations = async () => {
    setShowDestinations(true);
    setShowRecommendations(false);
    setShowItinerary(false);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.get("/destinations");

      console.log("DESTINATIONS:", response.data);

      setDestinations(
        Array.isArray(response.data)
          ? response.data
          : response.data.destinations || []
      );
    } catch (err) {
      console.error("DESTINATION ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load destinations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET RECOMMENDATIONS
  // =========================
  const getRecommendations = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first to get recommendations.");
      navigate("/login");
      return;
    }

    setShowRecommendations(true);
    setShowDestinations(false);
    setShowItinerary(false);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.get("/recommendations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RECOMMENDATIONS:", response.data);

      setRecommendations(
        Array.isArray(response.data)
          ? response.data
          : response.data.recommendations || []
      );
    } catch (err) {
      console.error("RECOMMENDATION ERROR:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Your login session has expired. Please login again.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN ITINERARY
  // =========================
  const openItinerary = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first to create an itinerary.");
      navigate("/login");
      return;
    }

    setShowItinerary(true);
    setShowDestinations(false);
    setShowRecommendations(false);

    setError("");
    setMessage("");
  };

  // =========================
  // CREATE ITINERARY
  // =========================
  const createItinerary = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
      setError("Please login before creating an itinerary.");
      navigate("/login");
      return;
    }

    if (!user?.id) {
      setError("User information is missing. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
      return;
    }

    if (!destination || !days) {
      setError("Please select a destination and enter the number of days.");
      return;
    }

    const itineraryData = {
      userId: user.id,
      destination: destination,
      days: Number(days),
    };

    console.log("SENDING ITINERARY:", itineraryData);

    try {
      const response = await API.post(
        "/itineraries",
        itineraryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ITINERARY RESPONSE:", response.data);

      setMessage("🎉 Itinerary created successfully!");

      const createdItinerary =
        response.data.itinerary || response.data;

      setItineraries((prev) => [
        ...prev,
        createdItinerary,
      ]);

      setDestination("");
      setDays("");

    } catch (err) {
      console.error("ITINERARY ERROR:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your login session has expired. Please login again."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to create itinerary."
      );
    }
  };

  return (
    <div style={pageStyle}>

      {/* =========================
          HERO
      ========================= */}
      <section style={heroStyle}>

        <div style={heroContentStyle}>

          <div style={badgeStyle}>
            🌍 Your Personal Travel Assistant
          </div>

          <h1 style={heroTitleStyle}>
            Explore the World with{" "}
            <span style={highlightStyle}>
              GlobeTrotter
            </span>
          </h1>

          <p style={heroDescriptionStyle}>
            Discover amazing destinations, get personalized
            recommendations, and create your perfect itinerary.
          </p>

          <div style={buttonContainerStyle}>

            <button
              onClick={exploreDestinations}
              style={primaryButtonStyle}
            >
              🌍 Explore Destinations
            </button>

            <button
              onClick={getRecommendations}
              style={secondaryButtonStyle}
            >
              ✨ Get Recommendations
            </button>

            <button
              onClick={openItinerary}
              style={secondaryButtonStyle}
            >
              🗺️ Plan My Trip
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          STATUS
      ========================= */}

      {loading && (
        <div style={loadingStyle}>
          <div style={spinnerStyle}>
            ⏳
          </div>

          Loading...
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          ❌ {error}
        </div>
      )}

      {message && (
        <div style={successStyle}>
          ✅ {message}
        </div>
      )}


      {/* =========================
          DESTINATIONS
      ========================= */}

      {showDestinations && (
        <section style={sectionStyle}>

          <h2 style={sectionTitleStyle}>
            🌍 Explore Destinations
          </h2>

          <p style={sectionSubtitleStyle}>
            Discover some amazing places around the world.
          </p>

          {destinations.length === 0 ? (
            <div style={emptyStyle}>
              No destinations found.
            </div>
          ) : (
            <div style={gridStyle}>

              {destinations.map((item, index) => (

                <div
                  key={item.id || item.name || index}
                  style={cardStyle}
                >

                  <div style={destinationIconStyle}>
                    🌍
                  </div>

                  <h3 style={cardTitleStyle}>
                    {item.name}
                  </h3>

                  <p style={countryStyle}>
                    📍 {item.country}
                  </p>

                  {item.category && (
                    <span style={categoryStyle}>
                      {item.category}
                    </span>
                  )}

                  <p style={cardDescriptionStyle}>
                    {item.description}
                  </p>

                </div>

              ))}

            </div>
          )}

        </section>
      )}


      {/* =========================
          RECOMMENDATIONS
      ========================= */}

      {showRecommendations && (
        <section style={sectionStyle}>

          <h2 style={sectionTitleStyle}>
            ✨ Recommended Destinations
          </h2>

          <p style={sectionSubtitleStyle}>
            Destinations selected for your travel experience.
          </p>

          {recommendations.length === 0 ? (
            <div style={emptyStyle}>
              No recommendations available.
            </div>
          ) : (
            <div style={gridStyle}>

              {recommendations.map((item, index) => (

                <div
                  key={item.id || item.name || index}
                  style={cardStyle}
                >

                  <div style={destinationIconStyle}>
                    ✨
                  </div>

                  <h3 style={cardTitleStyle}>
                    {item.name}
                  </h3>

                  <p style={countryStyle}>
                    📍 {item.country}
                  </p>

                  {item.category && (
                    <span style={categoryStyle}>
                      {item.category}
                    </span>
                  )}

                  <p style={cardDescriptionStyle}>
                    {item.description}
                  </p>

                  {item.match_score !== undefined && (
                    <div style={scoreStyle}>
                      ⭐ Match Score: {item.match_score}
                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>
      )}


      {/* =========================
          ITINERARY
      ========================= */}

      {showItinerary && (
        <section style={itinerarySectionStyle}>

          <div style={itineraryCardStyle}>

            <div style={itineraryIconStyle}>
              🗺️
            </div>

            <h2 style={sectionTitleStyle}>
              Create Your Itinerary
            </h2>

            <p style={sectionSubtitleStyle}>
              Plan your trip by choosing a destination
              and the number of days.
            </p>

            <form onSubmit={createItinerary}>

              {/* DESTINATION */}

              <div style={formGroupStyle}>

                <label style={labelStyle}>
                  Destination
                </label>

                <select
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value)
                  }
                  required
                  style={inputStyle}
                >

                  <option value="">
                    Select a destination
                  </option>

                  <option value="Paris">
                    Paris, France
                  </option>

                  <option value="Dubai">
                    Dubai, UAE
                  </option>

                  <option value="Cape Town">
                    Cape Town, South Africa
                  </option>

                  <option value="Nairobi">
                    Nairobi, Kenya
                  </option>

                </select>

              </div>


              {/* DAYS */}

              <div style={formGroupStyle}>

                <label style={labelStyle}>
                  Number of Days
                </label>

                <input
                  type="number"
                  min="1"
                  max="365"
                  value={days}
                  onChange={(e) =>
                    setDays(e.target.value)
                  }
                  placeholder="Example: 5"
                  required
                  style={inputStyle}
                />

              </div>


              <button
                type="submit"
                style={saveButtonStyle}
              >
                💾 Save Itinerary
              </button>

            </form>

          </div>


          {/* SAVED ITINERARIES */}

          {itineraries.length > 0 && (

            <div style={savedContainerStyle}>

              <h3 style={savedTitleStyle}>
                📋 Your New Itineraries
              </h3>

              {itineraries.map((item, index) => (

                <div
                  key={item.id || index}
                  style={savedCardStyle}
                >

                  <h4>
                    ✈️ {item.destination}
                  </h4>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {item.days} days
                  </p>

                </div>

              ))}

            </div>

          )}

        </section>
      )}

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
  minHeight: "100vh",
  background: "#f7f9fc",
  fontFamily: "Arial, sans-serif",
  paddingBottom: "60px",
};


const heroStyle = {
  padding: "80px 20px",
  textAlign: "center",
  background:
    "linear-gradient(135deg, #eaf2ff, #ffffff)",
};


const heroContentStyle = {
  maxWidth: "850px",
  margin: "0 auto",
};


const badgeStyle = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: "30px",
  background: "#ffffff",
  color: "#2563eb",
  fontWeight: "600",
  fontSize: "14px",
  marginBottom: "20px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};


const heroTitleStyle = {
  fontSize: "48px",
  lineHeight: "1.15",
  margin: "0 auto 20px",
  color: "#172033",
};


const highlightStyle = {
  color: "#2563eb",
};


const heroDescriptionStyle = {
  fontSize: "19px",
  lineHeight: "1.6",
  color: "#5b6472",
  maxWidth: "700px",
  margin: "0 auto",
};


const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "30px",
};


const primaryButtonStyle = {
  padding: "14px 22px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};


const secondaryButtonStyle = {
  padding: "14px 22px",
  border: "1px solid #2563eb",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#2563eb",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};


const loadingStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#2563eb",
  fontWeight: "600",
};


const spinnerStyle = {
  fontSize: "22px",
  marginBottom: "5px",
};


const errorStyle = {
  maxWidth: "900px",
  margin: "20px auto",
  padding: "14px 18px",
  borderRadius: "10px",
  background: "#ffecec",
  color: "#b91c1c",
  textAlign: "center",
  boxSizing: "border-box",
};


const successStyle = {
  maxWidth: "900px",
  margin: "20px auto",
  padding: "14px 18px",
  borderRadius: "10px",
  background: "#ecfff0",
  color: "#15803d",
  textAlign: "center",
  boxSizing: "border-box",
};


const sectionStyle = {
  maxWidth: "1100px",
  margin: "50px auto",
  padding: "0 20px",
};


const sectionTitleStyle = {
  textAlign: "center",
  fontSize: "30px",
  color: "#172033",
  marginBottom: "10px",
};


const sectionSubtitleStyle = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "30px",
};


const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "22px",
};


const cardStyle = {
  background: "#ffffff",
  borderRadius: "15px",
  padding: "25px",
  boxShadow:
    "0 5px 18px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};


const destinationIconStyle = {
  fontSize: "38px",
  marginBottom: "12px",
};


const cardTitleStyle = {
  fontSize: "22px",
  marginBottom: "8px",
  color: "#172033",
};


const countryStyle = {
  color: "#555f70",
  marginBottom: "12px",
};


const categoryStyle = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "20px",
  background: "#eef4ff",
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "600",
};


const cardDescriptionStyle = {
  color: "#6b7280",
  lineHeight: "1.6",
  marginTop: "15px",
};


const scoreStyle = {
  marginTop: "15px",
  padding: "10px",
  borderRadius: "8px",
  background: "#fff8e1",
  fontWeight: "600",
};


const emptyStyle = {
  textAlign: "center",
  padding: "30px",
  background: "#ffffff",
  borderRadius: "12px",
  color: "#777",
};


const itinerarySectionStyle = {
  maxWidth: "700px",
  margin: "50px auto",
  padding: "0 20px",
};


const itineraryCardStyle = {
  background: "#ffffff",
  padding: "35px",
  borderRadius: "18px",
  boxShadow:
    "0 8px 25px rgba(0,0,0,0.08)",
};


const itineraryIconStyle = {
  textAlign: "center",
  fontSize: "45px",
  marginBottom: "10px",
};


const formGroupStyle = {
  marginBottom: "22px",
};


const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#333",
};


const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box",
};


const saveButtonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};


const savedContainerStyle = {
  marginTop: "30px",
};


const savedTitleStyle = {
  marginBottom: "15px",
};


const savedCardStyle = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "10px",
  marginBottom: "10px",
  border: "1px solid #e5e7eb",
};


export default Home;