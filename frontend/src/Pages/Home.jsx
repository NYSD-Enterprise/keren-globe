import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/Api";

const destinationImages = [
  "/images/Paris.jpg",
  "/images/Dubia.jpg",
  "/images/Cape town.jpg",
  "/images/Nairobi.jpg",
  "/images/London.jpg",
  "/images/Rome.jpg",
  "/images/Cairo.jpg",
  "/images/Ictuniversity.jpg",
  "/images/Mount Cameroon.jpg",
  "/images/Kribi Beach.jpg",
  "/images/Limbe Beach.jpg",
  "/images/Mefou National Park.jpg",
  "/images/Waza National Park.jpg",
  "/images/Bamenda.jpg",
  "/images/National Mesuem of Yaounde.jpg",
  "/images/Yaounde.jpg",
];

function DestinationCard({ destination, index }) {
  const imagePath = destinationImages[index];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {imagePath && (
        <img
          src={imagePath}
          alt={destination.name || "Destination"}
          style={{
            width: "100%",
            height: "155px",
            objectFit: "cover",
            display: "block",
          }}
          onError={(event) => {
            console.error(
              "Image failed:",
              destination.name,
              imagePath
            );
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: "0 0 7px 0",
            fontSize: "19px",
            color: "#172033",
          }}
        >
          📍 {destination.name}
        </h3>

        <p
          style={{
            margin: "0 0 7px 0",
            fontWeight: "bold",
            color: "#374151",
          }}
        >
          {destination.country}
        </p>

        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "14px",
            color: "#2563eb",
          }}
        >
          <strong>Category:</strong> {destination.category}
        </p>

        <p
          style={{
            margin: "0 0 15px 0",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#4b5563",
            flex: 1,
          }}
        >
          {destination.description}
        </p>

        {destination.latitude && destination.longitude && (
          <a
            href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "9px 12px",
              borderRadius: "7px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            📍 View on Map
          </a>
        )}
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  const [showDestinations, setShowDestinations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [showItineraries, setShowItineraries] = useState(false);

  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);
  const [loadingItineraries, setLoadingItineraries] = useState(false);
  const [creatingItinerary, setCreatingItinerary] = useState(false);

  const [destinationError, setDestinationError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");
  const [itineraryError, setItineraryError] = useState("");
  const [itinerarySuccess, setItinerarySuccess] = useState("");

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [tripTitle, setTripTitle] = useState("");
  const [days, setDays] = useState(5);

  const loadDestinations = async () => {
    setDestinationError("");

    try {
      setLoadingDestinations(true);

      const response = await API.get("/destinations");

      const list = Array.isArray(response.data)
        ? response.data
        : response.data.destinations || [];

      setDestinations(list);

      return list;
    } catch (error) {
      console.error("Destination error:", error);

      setDestinationError(
        "Unable to load destinations. Make sure the API Gateway and Destination Service are running."
      );

      return [];
    } finally {
      setLoadingDestinations(false);
    }
  };

  const exploreDestinations = async () => {
    setShowDestinations(true);
    setShowRecommendations(false);
    setShowPlanner(false);
    setShowItineraries(false);

    await loadDestinations();
  };

  const getRecommendations = async () => {
    setShowRecommendations(true);
    setShowDestinations(false);
    setShowPlanner(false);
    setShowItineraries(false);

    setRecommendationError("");
    setRecommendations([]);

    try {
      setLoadingRecommendations(true);

      const response = await API.get("/recommendations");

      console.log("Recommendations response:", response.data);

      if (
        response.data &&
        Array.isArray(response.data.recommendations)
      ) {
        setRecommendations(response.data.recommendations);
      } else if (Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else {
        throw new Error("Invalid recommendation response format");
      }
    } catch (error) {
      console.error("Recommendation error:", error);

      setRecommendationError(
        "Unable to load recommendations. Make sure the API Gateway and Recommendation Service are running."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadItineraries = async () => {
    setShowItineraries(true);
    setShowDestinations(false);
    setShowRecommendations(false);
    setShowPlanner(false);

    setItineraryError("");

    try {
      setLoadingItineraries(true);

      const response = await API.get("/itineraries");

      console.log("Itineraries response:", response.data);

      if (
        response.data &&
        Array.isArray(response.data.itineraries)
      ) {
        setItineraries(response.data.itineraries);
      } else if (Array.isArray(response.data)) {
        setItineraries(response.data);
      } else {
        setItineraries([]);
      }
    } catch (error) {
      console.error("Itinerary loading error:", error);

      setItineraryError(
        "Unable to load itineraries. Make sure the API Gateway and Itinerary Service are running."
      );
    } finally {
      setLoadingItineraries(false);
    }
  };

  const createItinerary = async () => {
    setItineraryError("");
    setItinerarySuccess("");

    if (selectedDestinations.length === 0) {
      setItineraryError("Please select at least one destination.");
      return;
    }

    try {
      setCreatingItinerary(true);

      await API.post("/itineraries", {
        title: tripTitle,
        destinations: selectedDestinations,
        days: Number(days),
      });

      setItinerarySuccess("Itinerary created successfully!");

      setSelectedDestinations([]);
      setTripTitle("");
      setDays(5);

      await loadItineraries();
    } catch (error) {
      console.error("Create itinerary error:", error);

      setItineraryError(
        error.response?.data?.message ||
          "Unable to create itinerary. Please try again."
      );
    } finally {
      setCreatingItinerary(false);
    }
  };

  const toggleDestination = (name) => {
    setSelectedDestinations((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  };

  const openPlanner = async () => {
    const opening = !showPlanner;

    setShowPlanner(opening);
    setShowDestinations(false);
    setShowRecommendations(false);
    setShowItineraries(false);

    if (opening && destinations.length === 0) {
      await loadDestinations();
    }
  };

  const navButtonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="app-header"
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8, #2563eb)",
          color: "#ffffff",
          padding: "20px 25px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="app-header-inner"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0",
                fontSize: "28px",
              }}
            >
              GlobeTrotter 🌍
            </h1>

            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "14px",
                opacity: "0.9",
              }}
            >
              Your smart travel companion
            </p>
          </div>

          <div
            className="app-header-actions"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={navButtonStyle}
              onClick={exploreDestinations}
            >
              Explore
            </button>

            <button
              style={navButtonStyle}
              onClick={getRecommendations}
            >
              Recommendations
            </button>

            <button
              style={navButtonStyle}
              onClick={openPlanner}
            >
              Plan Trip
            </button>

            <button
              style={navButtonStyle}
              onClick={loadItineraries}
            >
              My Itineraries
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "35px 20px",
        }}
      >
        {/* Welcome Section */}
        <section
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px 0",
              fontSize: "30px",
              color: "#172033",
            }}
          >
            Discover Your Next Adventure ✈️
          </h2>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "700px",
              color: "#5b6472",
              lineHeight: "1.6",
            }}
          >
            Explore destinations, discover personalized
            recommendations, and create unforgettable travel
            itineraries with GlobeTrotter.
          </p>
        </section>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginBottom: "35px",
          }}
        >
          <button
            onClick={exploreDestinations}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🌍 Explore Destinations
          </button>

          <button
            onClick={getRecommendations}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#0f766e",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ⭐ Get Recommendations
          </button>

          <button
            onClick={openPlanner}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🗺️ Plan My Trip
          </button>

          <button
            onClick={loadItineraries}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#ea580c",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            📋 My Itineraries
          </button>
        </div>

        {/* Destinations */}
        {showDestinations && (
          <section>
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  margin: "0 0 5px 0",
                  color: "#172033",
                }}
              >
                Explore Destinations
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Discover amazing places around the world and
                across Cameroon.
              </p>
            </div>

            {loadingDestinations && (
              <p>Loading destinations...</p>
            )}

            {destinationError && (
              <p style={{ color: "red" }}>
                {destinationError}
              </p>
            )}

            {!loadingDestinations &&
              !destinationError &&
              destinations.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    alignItems: "stretch",
                  }}
                >
                  {destinations.map((destination, index) => (
                    <DestinationCard
                      key={destination.id || index}
                      destination={destination}
                      index={index}
                    />
                  ))}
                </div>
              )}
          </section>
        )}

        {/* Recommendations */}
        {showRecommendations && (
          <section style={{ marginTop: "10px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  margin: "0 0 5px 0",
                  color: "#172033",
                }}
              >
                Recommended Destinations ⭐
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                Discover destinations selected from our travel
                database.
              </p>
            </div>

            {loadingRecommendations && (
              <p>Loading recommendations...</p>
            )}

            {recommendationError && (
              <p style={{ color: "red" }}>
                {recommendationError}
              </p>
            )}

            {!loadingRecommendations &&
              !recommendationError &&
              recommendations.length === 0 && (
                <p>No recommendations found.</p>
              )}

            {!loadingRecommendations &&
              !recommendationError &&
              recommendations.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    alignItems: "stretch",
                  }}
                >
                  {recommendations.map((destination, index) => (
                    <DestinationCard
                      key={destination.id || index}
                      destination={destination}
                      index={index}
                    />
                  ))}
                </div>
              )}
          </section>
        )}

        {/* Planner */}
        {showPlanner && (
          <section
            style={{
              marginTop: "10px",
              padding: "28px",
              borderRadius: "14px",
              backgroundColor: "#ffffff",
              boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#172033",
              }}
            >
              Plan My Trip 🗺️
            </h2>

            <p style={{ color: "#6b7280" }}>
              Pick one or more destinations and specify how many days
              you want to travel.
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="trip-title">
                <strong>Trip name (optional):</strong>
              </label>

              <input
                id="trip-title"
                type="text"
                value={tripTitle}
                onChange={(event) => setTripTitle(event.target.value)}
                placeholder="Summer in Europe"
                style={{
                  display: "block",
                  marginTop: "6px",
                  width: "100%",
                  maxWidth: "360px",
                  padding: "9px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <strong>
                Destinations ({selectedDestinations.length} selected):
              </strong>

              {loadingDestinations && (
                <p style={{ color: "#6b7280" }}>Loading destinations...</p>
              )}

              {!loadingDestinations && destinations.length === 0 && (
                <p style={{ color: "#6b7280" }}>
                  No destinations available right now.
                </p>
              )}

              <div
                style={{
                  marginTop: "10px",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "8px",
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {destinations.map((destination, index) => {
                  const checked = selectedDestinations.includes(
                    destination.name
                  );

                  return (
                    <label
                      key={destination.id || index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: checked
                          ? "1px solid #2563eb"
                          : "1px solid #e5e7eb",
                        backgroundColor: checked ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleDestination(destination.name)
                        }
                      />

                      <span style={{ fontSize: "14px" }}>
                        {destination.name} - {destination.country}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label>
                <strong>Number of days:</strong>{" "}
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(event) =>
                    setDays(event.target.value)
                  }
                  style={{
                    width: "80px",
                    padding: "9px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>
            </div>

            <button
              onClick={createItinerary}
              disabled={creatingItinerary}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "7px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: creatingItinerary
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {creatingItinerary
                ? "Creating..."
                : "Create Itinerary"}
            </button>

            {itineraryError && (
              <p style={{ color: "red" }}>
                {itineraryError}
              </p>
            )}

            {itinerarySuccess && (
              <p style={{ color: "green" }}>
                {itinerarySuccess}
              </p>
            )}
          </section>
        )}

        {/* Itineraries */}
        {showItineraries && (
          <section style={{ marginTop: "10px" }}>
            <h2
              style={{
                marginBottom: "20px",
                color: "#172033",
              }}
            >
              My Itineraries 📋
            </h2>

            {loadingItineraries && (
              <p>Loading itineraries...</p>
            )}

            {itineraryError && (
              <p style={{ color: "red" }}>
                {itineraryError}
              </p>
            )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.length === 0 && (
                <p>No itineraries found.</p>
              )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.map((itinerary, index) => (
                <div
                  key={itinerary.id || index}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/itineraries/${itinerary.id}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/itineraries/${itinerary.id}`);
                    }
                  }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "18px",
                    marginBottom: "15px",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: "#172033",
                    }}
                  >
                    🗺️ {itinerary.title || "Trip"}
                  </h3>

                  <p style={{ color: "#4b5563" }}>
                    📍{" "}
                    {(itinerary.destinations || []).join(" → ") ||
                      "No destinations"}
                  </p>

                  <p>
                    <strong>Days:</strong>{" "}
                    {itinerary.days || "N/A"}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    View details →
                  </p>
                </div>
              ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "40px",
          padding: "25px",
          textAlign: "center",
          backgroundColor: "#172033",
          color: "#ffffff",
        }}
      >
        <strong>GlobeTrotter 🌍</strong>

        <p
          style={{
            margin: "7px 0 0 0",
            fontSize: "13px",
            opacity: "0.8",
          }}
        >
          Discover. Plan. Travel.
        </p>
      </footer>
    </div>
  );
}

export default Home;