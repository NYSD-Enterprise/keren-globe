import { useState } from "react";
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
        background: "#ffffff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e5e7eb",
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
            height: "190px",
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
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#172033",
            }}
          >
            📍 {destination.name}
          </h3>

          <span
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              padding: "5px 9px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            {destination.category || "Destination"}
          </span>
        </div>

        <p
          style={{
            margin: "0 0 10px",
            color: "#475569",
            fontWeight: "600",
          }}
        >
          {destination.country}
        </p>

        <p
          style={{
            margin: "0 0 18px",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#64748b",
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
              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              padding: "11px 14px",
              borderRadius: "9px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "700",
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

  const [selectedDestination, setSelectedDestination] = useState("");
  const [days, setDays] = useState(5);

  const exploreDestinations = async () => {
    setShowDestinations(true);
    setShowRecommendations(false);
    setShowPlanner(false);
    setShowItineraries(false);

    setDestinationError("");

    try {
      setLoadingDestinations(true);

      const response = await API.get("/destinations");

      console.log("Destinations:", response.data);

      setDestinations(response.data);
    } catch (error) {
      console.error("Destination error:", error);

      setDestinationError(
        "Unable to load destinations. Make sure the API Gateway and Destination Service are running."
      );
    } finally {
      setLoadingDestinations(false);
    }
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

    if (!selectedDestination) {
      setItineraryError("Please select a destination.");
      return;
    }

    try {
      setCreatingItinerary(true);

      console.log("Creating itinerary:", {
        userId: "demo-user",
        destination: selectedDestination,
        days: Number(days),
      });

      const response = await API.post("/itineraries", {
        userId: "demo-user",
        destination: selectedDestination,
        days: Number(days),
      });

      console.log("Created itinerary:", response.data);

      setItinerarySuccess("Itinerary created successfully!");

      setSelectedDestination("");
      setDays(5);

      await loadItineraries();
    } catch (error) {
      console.error("Create itinerary error:", error);

      setItineraryError(
        "Unable to create itinerary. Make sure the API Gateway and Itinerary Service are running."
      );
    } finally {
      setCreatingItinerary(false);
    }
  };

  const openPlanner = () => {
    setShowPlanner(!showPlanner);
    setShowDestinations(false);
    setShowRecommendations(false);
    setShowItineraries(false);
  };

  const navButtonStyle = {
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "8px",
    padding: "9px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
  };

  const quickActionStyle = {
    border: "none",
    borderRadius: "12px",
    padding: "17px",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 6px 15px rgba(15,23,42,0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        color: "#172033",
      }}
    >
      {/* NAVBAR */}
      <header
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #0ea5e9 100%)",
          color: "#ffffff",
          padding: "18px 25px",
          boxShadow: "0 5px 20px rgba(15,23,42,0.15)",
        }}
      >
        <div
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
                margin: 0,
                fontSize: "27px",
                letterSpacing: "-0.5px",
              }}
            >
              GlobeTrotter 🌍
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                opacity: 0.88,
              }}
            >
              Your smart travel companion
            </p>
          </div>

          <nav
            style={{
              display: "flex",
              gap: "7px",
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
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "35px 20px 50px",
        }}
      >
        {/* HERO */}
        <section
          style={{
            borderRadius: "22px",
            padding: "55px 30px",
            marginBottom: "28px",
            textAlign: "center",
            background:
              "linear-gradient(135deg, #dbeafe, #eff6ff 55%, #e0f2fe)",
            border: "1px solid #dbeafe",
            boxShadow: "0 10px 30px rgba(37,99,235,0.08)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#ffffff",
              color: "#2563eb",
              padding: "7px 13px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "14px",
            }}
          >
            ✈️ TRAVEL SMARTER
          </div>

          <h2
            style={{
              margin: "0 0 13px",
              fontSize: "38px",
              lineHeight: "1.15",
              color: "#172033",
            }}
          >
            Discover Your Next Adventure
          </h2>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "720px",
              color: "#526071",
              lineHeight: "1.7",
              fontSize: "16px",
            }}
          >
            Explore amazing destinations, discover personalized
            recommendations, and create unforgettable travel
            itineraries with GlobeTrotter.
          </p>
        </section>

        {/* STATS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "30px",
          }}
        >
          {[
            ["🌍", "16+", "Destinations"],
            ["⭐", "5+", "Travel Categories"],
            ["🗺️", "2", "Continents"],
            ["✈️", "24/7", "Travel Planning"],
          ].map(([icon, number, label]) => (
            <div
              key={label}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "20px",
                textAlign: "center",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 6px 18px rgba(15,23,42,0.05)",
              }}
            >
              <div style={{ fontSize: "24px" }}>{icon}</div>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#2563eb",
                  marginTop: "4px",
                }}
              >
                {number}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "600",
                  marginTop: "2px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </section>

        {/* QUICK ACTIONS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={exploreDestinations}
            style={{
              ...quickActionStyle,
              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",
            }}
          >
            🌍 Explore Destinations
          </button>

          <button
            onClick={getRecommendations}
            style={{
              ...quickActionStyle,
              background:
                "linear-gradient(135deg, #0f766e, #0d9488)",
            }}
          >
            ⭐ Get Recommendations
          </button>

          <button
            onClick={openPlanner}
            style={{
              ...quickActionStyle,
              background:
                "linear-gradient(135deg, #7c3aed, #6d28d9)",
            }}
          >
            🗺️ Plan My Trip
          </button>

          <button
            onClick={loadItineraries}
            style={{
              ...quickActionStyle,
              background:
                "linear-gradient(135deg, #ea580c, #c2410c)",
            }}
          >
            📋 My Itineraries
          </button>
        </section>

        {/* DESTINATIONS */}
        {showDestinations && (
          <section>
            <div
              style={{
                marginBottom: "22px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#2563eb",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                EXPLORE
              </span>

              <h2
                style={{
                  margin: "6px 0",
                  fontSize: "30px",
                  color: "#172033",
                }}
              >
                Explore Destinations 🌍
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                Discover amazing places around the world and
                across Cameroon.
              </p>
            </div>

            {loadingDestinations && (
              <div
                style={{
                  textAlign: "center",
                  padding: "35px",
                  background: "#ffffff",
                  borderRadius: "14px",
                }}
              >
                🔄 Loading destinations...
              </div>
            )}

            {destinationError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                }}
              >
                ⚠️ {destinationError}
              </div>
            )}

            {!loadingDestinations &&
              !destinationError &&
              destinations.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "22px",
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

        {/* RECOMMENDATIONS */}
        {showRecommendations && (
          <section>
            <div
              style={{
                marginBottom: "22px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#0f766e",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                PERSONALIZED DISCOVERY
              </span>

              <h2
                style={{
                  margin: "6px 0",
                  fontSize: "30px",
                  color: "#172033",
                }}
              >
                Recommended Destinations ⭐
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                Discover destinations selected from our travel
                database.
              </p>
            </div>

            {loadingRecommendations && (
              <div
                style={{
                  textAlign: "center",
                  padding: "35px",
                  background: "#ffffff",
                  borderRadius: "14px",
                }}
              >
                🔄 Loading recommendations...
              </div>
            )}

            {recommendationError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                }}
              >
                ⚠️ {recommendationError}
              </div>
            )}

            {!loadingRecommendations &&
              !recommendationError &&
              recommendations.length === 0 && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "30px",
                    borderRadius: "14px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No recommendations found.
                </div>
              )}

            {!loadingRecommendations &&
              !recommendationError &&
              recommendations.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "22px",
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

        {/* WHY GLOBETROTTER */}
        {!showDestinations &&
          !showRecommendations &&
          !showPlanner &&
          !showItineraries && (
            <section
              style={{
                marginTop: "15px",
                marginBottom: "35px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                  }}
                >
                  WHY GLOBETROTTER?
                </span>

                <h2
                  style={{
                    margin: "6px 0",
                    fontSize: "28px",
                  }}
                >
                  Everything You Need for Better Trips
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: "18px",
                }}
              >
                {[
                  [
                    "🌍",
                    "Discover",
                    "Explore destinations around the world and discover beautiful places across Cameroon.",
                  ],
                  [
                    "⭐",
                    "Personalize",
                    "Get travel recommendations from our destination database.",
                  ],
                  [
                    "🗺️",
                    "Plan",
                    "Create and manage travel itineraries based on your destination and trip duration.",
                  ],
                ].map(([icon, title, description]) => (
                  <div
                    key={title}
                    style={{
                      background: "#ffffff",
                      padding: "25px",
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 7px 20px rgba(15,23,42,0.05)",
                    }}
                  >
                    <div style={{ fontSize: "30px" }}>
                      {icon}
                    </div>

                    <h3
                      style={{
                        margin: "10px 0 8px",
                        color: "#172033",
                      }}
                    >
                      {title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        lineHeight: "1.6",
                        fontSize: "14px",
                      }}
                    >
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* PLANNER */}
        {showPlanner && (
          <section
            style={{
              padding: "30px",
              borderRadius: "18px",
              background: "#ffffff",
              boxShadow:
                "0 8px 25px rgba(15,23,42,0.07)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ marginBottom: "25px" }}>
              <span
                style={{
                  color: "#7c3aed",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                TRIP PLANNER
              </span>

              <h2
                style={{
                  margin: "6px 0",
                  fontSize: "30px",
                }}
              >
                Plan My Trip 🗺️
              </h2>

              <p style={{ color: "#64748b" }}>
                Choose a destination and specify how many days
                you want to stay.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "22px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "700",
                  }}
                >
                  Destination
                </label>

                <select
                  value={selectedDestination}
                  onChange={(event) =>
                    setSelectedDestination(event.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "9px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                >
                  <option value="">
                    -- Select a destination --
                  </option>

                  {destinations.map((destination, index) => (
                    <option
                      key={destination.id || index}
                      value={destination.name}
                    >
                      {destination.name} - {destination.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "700",
                  }}
                >
                  Number of days
                </label>

                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(event) =>
                    setDays(event.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    borderRadius: "9px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <button
              onClick={createItinerary}
              disabled={creatingItinerary}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "9px",
                background:
                  "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#ffffff",
                fontWeight: "700",
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
              <p style={{ color: "#b91c1c" }}>
                ⚠️ {itineraryError}
              </p>
            )}

            {itinerarySuccess && (
              <p style={{ color: "#15803d" }}>
                ✅ {itinerarySuccess}
              </p>
            )}
          </section>
        )}

        {/* ITINERARIES */}
        {showItineraries && (
          <section>
            <div
              style={{
                marginBottom: "22px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#ea580c",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                }}
              >
                YOUR TRAVEL PLANS
              </span>

              <h2
                style={{
                  margin: "6px 0",
                  fontSize: "30px",
                }}
              >
                My Itineraries 📋
              </h2>
            </div>

            {loadingItineraries && (
              <div
                style={{
                  textAlign: "center",
                  padding: "35px",
                  background: "#ffffff",
                  borderRadius: "14px",
                }}
              >
                🔄 Loading itineraries...
              </div>
            )}

            {itineraryError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                }}
              >
                ⚠️ {itineraryError}
              </div>
            )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.length === 0 && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "35px",
                    borderRadius: "14px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No itineraries found yet.
                </div>
              )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.map((itinerary, index) => (
                <div
                  key={itinerary.id || index}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "22px",
                    marginBottom: "15px",
                    boxShadow:
                      "0 5px 15px rgba(15,23,42,0.05)",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: "#172033",
                    }}
                  >
                    📍 {itinerary.destination || "Trip"}
                  </h3>

                  <p style={{ color: "#64748b" }}>
                    <strong>Days:</strong>{" "}
                    {itinerary.days || "N/A"}
                  </p>

                  <p style={{ color: "#64748b" }}>
                    <strong>User:</strong>{" "}
                    {itinerary.userId || "demo-user"}
                  </p>
                </div>
              ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: "#172033",
          color: "#ffffff",
          marginTop: "30px",
          padding: "35px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: "0 0 7px",
              fontSize: "21px",
            }}
          >
            GlobeTrotter 🌍
          </h3>

          <p
            style={{
              margin: "0 0 15px",
              color: "#cbd5e1",
              fontSize: "14px",
            }}
          >
            Discover. Plan. Travel.
          </p>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            Explore • Recommendations • Plan Trip • My
            Itineraries
          </p>

          <div
            style={{
              height: "1px",
              background: "#334155",
              margin: "20px 0",
            }}
          />

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            © 2026 GlobeTrotter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;