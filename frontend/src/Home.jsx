import { useEffect, useState } from "react";
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
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: "20px",
            color: "#172033",
          }}
        >
          📍 {destination.name}
        </h3>

        <p
          style={{
            margin: "0 0 8px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          {destination.country}
        </p>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: "14px",
            color: "#2563eb",
            fontWeight: "600",
          }}
        >
          Category: {destination.category}
        </p>

        <p
          style={{
            margin: "0 0 18px",
            fontSize: "14px",
            lineHeight: "1.6",
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
              padding: "10px 14px",
              borderRadius: "8px",
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

  const [showDestinations, setShowDestinations] = useState(true);
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

  // Fetch destinations from the API
  const fetchDestinations = async () => {
    setDestinationError("");

    try {
      setLoadingDestinations(true);

      const response = await API.get("/destinations");

      console.log("Destinations:", response.data);

      if (Array.isArray(response.data)) {
        setDestinations(response.data);
      } else if (response.data?.destinations) {
        setDestinations(response.data.destinations);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      console.error("Destination error:", error);

      setDestinationError(
        "Unable to load destinations. Make sure the API Gateway and Destination Service are running."
      );
    } finally {
      setLoadingDestinations(false);
    }
  };

  // Automatically load destinations when Home opens
  useEffect(() => {
    fetchDestinations();
  }, []);

  const exploreDestinations = async () => {
    setShowDestinations(true);
    setShowRecommendations(false);
    setShowPlanner(false);
    setShowItineraries(false);

    await fetchDestinations();
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

      const response = await API.post("/itineraries", {
        userId: "demo-user",
        destination: selectedDestination,
        days: Number(days),
      });

      console.log("Created itinerary:", response.data);

      setItinerarySuccess(
        "Itinerary created successfully!"
      );

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

  const openPlanner = async () => {
    setShowPlanner(true);
    setShowDestinations(false);
    setShowRecommendations(false);
    setShowItineraries(false);

    // If destinations have not loaded yet,
    // fetch them without changing the current screen.
    if (destinations.length === 0) {
      await fetchDestinations();
    }
  };

  const navButtonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#1d4ed8",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        color: "#172033",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8, #2563eb, #0f766e)",
          color: "#ffffff",
          padding: "22px 25px",
          boxShadow: "0 5px 20px rgba(15, 23, 42, 0.15)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
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
                fontSize: "30px",
                fontWeight: "800",
              }}
            >
              🌍 GlobeTrotter
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              Your smart travel companion
            </p>
          </div>

          <div
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

      {/* MAIN */}
      <main
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "35px 20px 50px",
        }}
      >
        {/* HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #ffffff, #eff6ff)",
            borderRadius: "22px",
            padding: "45px 25px",
            marginBottom: "30px",
            boxShadow:
              "0 8px 25px rgba(15, 23, 42, 0.08)",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            🌍
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#172033",
            }}
          >
            Discover Your Next Adventure ✈️
          </h2>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "750px",
              color: "#5b6472",
              lineHeight: "1.7",
              fontSize: "16px",
            }}
          >
            Explore amazing destinations, discover personalized
            recommendations, and create unforgettable travel
            itineraries with GlobeTrotter.
          </p>
        </section>

        {/* QUICK ACTIONS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={exploreDestinations}
            style={{
              padding: "18px",
              border: "none",
              borderRadius: "12px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow:
                "0 5px 15px rgba(37, 99, 235, 0.25)",
            }}
          >
            🌍 Explore Destinations
          </button>

          <button
            onClick={getRecommendations}
            style={{
              padding: "18px",
              border: "none",
              borderRadius: "12px",
              background: "#0f766e",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow:
                "0 5px 15px rgba(15, 118, 110, 0.25)",
            }}
          >
            ⭐ Get Recommendations
          </button>

          <button
            onClick={openPlanner}
            style={{
              padding: "18px",
              border: "none",
              borderRadius: "12px",
              background: "#7c3aed",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow:
                "0 5px 15px rgba(124, 58, 237, 0.25)",
            }}
          >
            🗺️ Plan My Trip
          </button>

          <button
            onClick={loadItineraries}
            style={{
              padding: "18px",
              border: "none",
              borderRadius: "12px",
              background: "#ea580c",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow:
                "0 5px 15px rgba(234, 88, 12, 0.25)",
            }}
          >
            📋 My Itineraries
          </button>
        </section>

        {/* DESTINATIONS */}
        {showDestinations && (
          <section>
            <div style={{ marginBottom: "22px" }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: "28px",
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
                Discover amazing places around the world
                and across Cameroon.
              </p>
            </div>

            {loadingDestinations && (
              <div
                style={{
                  background: "#ffffff",
                  padding: "25px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                Loading destinations...
              </div>
            )}

            {destinationError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                {destinationError}
              </div>
            )}

            {!loadingDestinations &&
              !destinationError &&
              destinations.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "22px",
                  }}
                >
                  {destinations.map(
                    (destination, index) => (
                      <DestinationCard
                        key={
                          destination.id || index
                        }
                        destination={destination}
                        index={index}
                      />
                    )
                  )}
                </div>
              )}
          </section>
        )}

        {/* RECOMMENDATIONS */}
        {showRecommendations && (
          <section>
            <div style={{ marginBottom: "22px" }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: "28px",
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
                Discover destinations selected from our
                travel database.
              </p>
            </div>

            {loadingRecommendations && (
              <div
                style={{
                  background: "#ffffff",
                  padding: "25px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                Loading recommendations...
              </div>
            )}

            {recommendationError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                {recommendationError}
              </div>
            )}

            {!loadingRecommendations &&
              !recommendationError &&
              recommendations.length === 0 && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "25px",
                    borderRadius: "12px",
                    textAlign: "center",
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
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "22px",
                  }}
                >
                  {recommendations.map(
                    (destination, index) => (
                      <DestinationCard
                        key={
                          destination.id || index
                        }
                        destination={destination}
                        index={index}
                      />
                    )
                  )}
                </div>
              )}
          </section>
        )}

        {/* PLANNER */}
        {showPlanner && (
          <section
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "18px",
              boxShadow:
                "0 6px 20px rgba(15, 23, 42, 0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: "28px",
              }}
            >
              Plan My Trip 🗺️
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "25px",
              }}
            >
              Choose a destination and specify how many
              days you want to stay.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Destination
              </label>

              <select
                value={selectedDestination}
                onChange={(event) =>
                  setSelectedDestination(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  background: "#ffffff",
                }}
              >
                <option value="">
                  -- Select a destination --
                </option>

                {destinations.map(
                  (destination, index) => (
                    <option
                      key={
                        destination.id || index
                      }
                      value={destination.name}
                    >
                      {destination.name} -{" "}
                      {destination.country}
                    </option>
                  )
                )}
              </select>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
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
                  width: "100px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                }}
              />
            </div>

            <button
              onClick={createItinerary}
              disabled={creatingItinerary}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                background: creatingItinerary
                  ? "#9ca3af"
                  : "#2563eb",
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
              <p
                style={{
                  color: "#b91c1c",
                  marginTop: "15px",
                }}
              >
                {itineraryError}
              </p>
            )}

            {itinerarySuccess && (
              <p
                style={{
                  color: "#15803d",
                  marginTop: "15px",
                  fontWeight: "600",
                }}
              >
                {itinerarySuccess}
              </p>
            )}
          </section>
        )}

        {/* ITINERARIES */}
        {showItineraries && (
          <section>
            <div style={{ marginBottom: "22px" }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: "28px",
                }}
              >
                My Itineraries 📋
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                View the trips you have created.
              </p>
            </div>

            {loadingItineraries && (
              <div
                style={{
                  background: "#ffffff",
                  padding: "25px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                Loading itineraries...
              </div>
            )}

            {itineraryError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                {itineraryError}
              </div>
            )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.length === 0 && (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "25px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  No itineraries found.
                </div>
              )}

            {!loadingItineraries &&
              !itineraryError &&
              itineraries.map(
                (itinerary, index) => (
                  <div
                    key={
                      itinerary.id || index
                    }
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      padding: "24px",
                      marginBottom: "16px",
                      boxShadow:
                        "0 5px 15px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 8px",
                            fontSize: "21px",
                            color: "#172033",
                          }}
                        >
                          📍{" "}
                          {itinerary.destination ||
                            "Trip"}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#6b7280",
                          }}
                        >
                          Your planned travel experience
                        </p>
                      </div>

                      <div
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "10px 16px",
                          borderRadius: "20px",
                          fontWeight: "700",
                        }}
                      >
                        {itinerary.days || "N/A"}{" "}
                        day(s)
                      </div>
                    </div>
                  </div>
                )
              )}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          padding: "30px 20px",
          textAlign: "center",
          background: "#172033",
          color: "#ffffff",
        }}
      >
        <strong style={{ fontSize: "18px" }}>
          🌍 GlobeTrotter
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: "13px",
            opacity: 0.75,
          }}
        >
          Discover. Plan. Travel.
        </p>
      </footer>
    </div>
  );
}

export default Home;