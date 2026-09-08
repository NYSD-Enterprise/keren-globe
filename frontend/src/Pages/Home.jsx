   import { useState } from "react";
import API from "../Services/Api";

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

  // ==========================================
  // EXPLORE DESTINATIONS
  // ==========================================
  const exploreDestinations = async () => {
    setShowDestinations(true);
    setDestinationError("");

    try {
      setLoadingDestinations(true);

      const response = await API.get("/destinations");

      console.log("Destinations:", response.data);

      if (Array.isArray(response.data)) {
        setDestinations(response.data);
      } else if (Array.isArray(response.data?.destinations)) {
        setDestinations(response.data.destinations);
      } else {
        setDestinations([]);
        setDestinationError("Invalid destination data received.");
      }
    } catch (error) {
      console.error("Destination error:", error);

      setDestinations([]);

      setDestinationError(
        "Unable to load destinations. Make sure the API Gateway and Destination Service are running."
      );
    } finally {
      setLoadingDestinations(false);
    }
  };

  // ==========================================
  // GET RECOMMENDATIONS
  // ==========================================
  const getRecommendations = async () => {
    setShowRecommendations(true);
    setRecommendationError("");
    setRecommendations([]);

    try {
      setLoadingRecommendations(true);

      const response = await API.get("/recommendations");

      console.log("Recommendations:", response.data);

      const recommendationList =
        response.data?.recommendations;

      console.log(
        "Recommendation list:",
        recommendationList
      );

      if (Array.isArray(recommendationList)) {
        setRecommendations(recommendationList);
      } else {
        console.error(
          "recommendations is not an array:",
          recommendationList
        );

        setRecommendationError(
          "Invalid recommendation data received."
        );
      }
    } catch (error) {
      console.error("Recommendation error:", error);

      setRecommendationError(
        "Unable to load recommendations. Make sure the Recommendation Service is running."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // ==========================================
  // OPEN GOOGLE MAP
  // ==========================================
  const openMap = (destination) => {
    if (
      destination.latitude === undefined ||
      destination.longitude === undefined
    ) {
      alert("Map coordinates are not available.");
      return;
    }

    const mapUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      destination.latitude +
      "," +
      destination.longitude;

    window.open(mapUrl, "_blank");
  };

  // ==========================================
  // OPEN ITINERARY PLANNER
  // ==========================================
  const planTrip = () => {
    setShowPlanner(true);
    setItinerarySuccess("");
    setItineraryError("");

    // Load destinations if they haven't been loaded yet
    if (destinations.length === 0) {
      exploreDestinations();
    }
  };

  // ==========================================
  // CREATE ITINERARY
  // ==========================================
  const createItinerary = async (event) => {
    event.preventDefault();

    setItineraryError("");
    setItinerarySuccess("");

    if (!selectedDestination) {
      setItineraryError("Please select a destination.");
      return;
    }

    if (!days || Number(days) < 1) {
      setItineraryError(
        "Please enter at least 1 day."
      );
      return;
    }

    try {
      setCreatingItinerary(true);

      const itineraryData = {
        userId: "demo-user",
        destination: selectedDestination,
        days: Number(days),
      };

      console.log(
        "Creating itinerary:",
        itineraryData
      );

      const response = await API.post(
        "/itineraries",
        itineraryData
      );

      console.log(
        "Itinerary response:",
        response.data
      );

      setItinerarySuccess(
        "Itinerary created successfully!"
      );

      // Add the newly created itinerary to the screen
      if (response.data?.itinerary) {
        setItineraries((previous) => [
          response.data.itinerary,
          ...previous,
        ]);
      }

      setShowItineraries(true);

      // Clear form
      setSelectedDestination("");
      setDays(5);
    } catch (error) {
      console.error(
        "Create itinerary error:",
        error
      );

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );
      }

      setItineraryError(
        "Unable to create itinerary. Make sure the API Gateway and Itinerary Service are running."
      );
    } finally {
      setCreatingItinerary(false);
    }
  };

  // ==========================================
  // GET ALL ITINERARIES
  // ==========================================
  const loadItineraries = async () => {
    setShowItineraries(true);
    setItineraryError("");

    try {
      setLoadingItineraries(true);

      const response = await API.get("/itineraries");

      console.log(
        "Itineraries response:",
        response.data
      );

      if (Array.isArray(response.data?.itineraries)) {
        setItineraries(response.data.itineraries);
      } else if (Array.isArray(response.data)) {
        setItineraries(response.data);
      } else {
        setItineraries([]);
        setItineraryError(
          "No itinerary data was received."
        );
      }
    } catch (error) {
      console.error(
        "Get itineraries error:",
        error
      );

      setItineraryError(
        "Unable to load itineraries. Make sure the API Gateway and Itinerary Service are running."
      );
    } finally {
      setLoadingItineraries(false);
    }
  };

  // ==========================================
  // DESTINATION CARD
  // ==========================================
  const DestinationCard = ({
    destination,
    recommended = false,
  }) => {
    const location =
      destination.city && destination.country
        ? `${destination.city}, ${destination.country}`
        : destination.country ||
          "Unknown location";

    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.10)",
        }}
      >
        <h3
          style={{
            fontSize: "22px",
            marginBottom: "10px",
          }}
        >
          {recommended ? "⭐" : "📍"}{" "}
          {destination.name ||
            "Unnamed destination"}
        </h3>

        <p
          style={{
            color: "#555",
            marginBottom: "10px",
          }}
        >
          {location}
        </p>

        <p
          style={{
            marginBottom: "10px",
          }}
        >
          <strong>Category:</strong>{" "}
          {destination.category ||
            "General"}
        </p>

        <p
          style={{
            color: "#444",
            lineHeight: "1.6",
            minHeight: "55px",
          }}
        >
          {destination.description ||
            "Discover this amazing destination."}
        </p>

        {destination.latitude !==
          undefined &&
          destination.longitude !==
            undefined && (
            <button
              onClick={() =>
                openMap(destination)
              }
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              📍 View on Map
            </button>
          )}
      </div>
    );
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        paddingBottom: "60px",
      }}
    >
      {/* ======================================
          HERO
      ====================================== */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#ffffff",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            margin: "0 0 15px 0",
            fontWeight: "700",
          }}
        >
          GlobeTrotter 🌍
        </h1>

        <p
          style={{
            fontSize: "20px",
            maxWidth: "700px",
            margin: "0 auto 30px auto",
            lineHeight: "1.6",
          }}
        >
          Your smart travel assistant for
          discovering destinations, getting
          recommendations and planning
          unforgettable trips.
        </p>

        <div>
          <button
            onClick={exploreDestinations}
            style={{
              padding: "14px 24px",
              margin: "8px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Explore Destinations
          </button>

          <button
            onClick={getRecommendations}
            style={{
              padding: "14px 24px",
              margin: "8px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Get Recommendations
          </button>

          <button
            onClick={planTrip}
            style={{
              padding: "14px 24px",
              margin: "8px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Plan My Trip
          </button>

          <button
            onClick={loadItineraries}
            style={{
              padding: "14px 24px",
              margin: "8px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            My Itineraries
          </button>
        </div>
      </section>

      {/* ======================================
          ITINERARY PLANNER
      ====================================== */}
      {showPlanner && (
        <section
          style={{
            padding: "50px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.10)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "32px",
                marginBottom: "10px",
              }}
            >
              Plan My Trip 🗺️
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "30px",
              }}
            >
              Choose a destination and
              specify how many days you
              want to stay.
            </p>

            <form
              onSubmit={createItinerary}
            >
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
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
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              >
                <option value="">
                  -- Select a destination --
                </option>

                {destinations.map(
                  (destination, index) => (
                    <option
                      key={
                        destination.id ||
                        destination._id ||
                        index
                      }
                      value={
                        destination.name
                      }
                    >
                      {destination.name}
                      {destination.country
                        ? ` - ${destination.country}`
                        : ""}
                    </option>
                  )
                )}
              </select>

              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Number of Days
              </label>

              <input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(event) =>
                  setDays(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="submit"
                disabled={creatingItinerary}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor:
                    creatingItinerary
                      ? "#999"
                      : "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: creatingItinerary
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "17px",
                  fontWeight: "600",
                }}
              >
                {creatingItinerary
                  ? "Creating..."
                  : "Create Itinerary"}
              </button>
            </form>

            {itinerarySuccess && (
              <p
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                ✅ {itinerarySuccess}
              </p>
            )}

            {itineraryError && (
              <p
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                {itineraryError}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ======================================
          DESTINATIONS
      ====================================== */}
      {showDestinations && (
        <section
          style={{
            padding: "50px 20px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              marginBottom: "30px",
            }}
          >
            Explore Destinations
          </h2>

          {loadingDestinations && (
            <p
              style={{
                textAlign: "center",
              }}
            >
              Loading destinations...
            </p>
          )}

          {destinationError && (
            <p
              style={{
                textAlign: "center",
                color: "red",
              }}
            >
              {destinationError}
            </p>
          )}

          {destinations.length > 0 && (
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {destinations.map(
                (destination, index) => (
                  <DestinationCard
                    key={
                      destination.id ||
                      destination._id ||
                      index
                    }
                    destination={destination}
                  />
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================
          RECOMMENDATIONS
      ====================================== */}
      {showRecommendations && (
        <section
          style={{
            padding: "50px 20px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              marginBottom: "30px",
            }}
          >
            Recommended Destinations
          </h2>

          {loadingRecommendations && (
            <p
              style={{
                textAlign: "center",
              }}
            >
              Loading recommendations...
            </p>
          )}

          {recommendationError && (
            <p
              style={{
                textAlign: "center",
                color: "red",
              }}
            >
              {recommendationError}
            </p>
          )}

          {recommendations.length > 0 && (
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {recommendations.map(
                (destination, index) => (
                  <DestinationCard
                    key={
                      destination.id ||
                      destination._id ||
                      index
                    }
                    destination={destination}
                    recommended={true}
                  />
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* ======================================
          ITINERARIES
      ====================================== */}
      {showItineraries && (
        <section
          style={{
            padding: "50px 20px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              marginBottom: "30px",
            }}
          >
            My Itineraries 📋
          </h2>

          {loadingItineraries && (
            <p
              style={{
                textAlign: "center",
              }}
            >
              Loading itineraries...
            </p>
          )}

          {itineraryError && (
            <p
              style={{
                textAlign: "center",
                color: "red",
              }}
            >
              {itineraryError}
            </p>
          )}

          {!loadingItineraries &&
            itineraries.length === 0 &&
            !itineraryError && (
              <p
                style={{
                  textAlign: "center",
                }}
              >
                No itineraries found.
              </p>
            )}

          {itineraries.length > 0 && (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                display: "grid",
                gap: "20px",
              }}
            >
              {itineraries.map(
                (itinerary, index) => (
                  <div
                    key={
                      itinerary.id ||
                      itinerary._id ||
                      index
                    }
                    style={{
                      backgroundColor:
                        "#ffffff",
                      padding: "24px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.10)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "22px",
                        marginBottom: "12px",
                      }}
                    >
                      ✈️{" "}
                      {itinerary.destination}
                    </h3>

                    <p>
                      <strong>User:</strong>{" "}
                      {itinerary.userId ||
                        "Unknown"}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {itinerary.days} day
                      {Number(
                        itinerary.days
                      ) !== 1
                        ? "s"
                        : ""}
                    </p>

                    <p>
                      <strong>Itinerary ID:</strong>{" "}
                      {itinerary.id ||
                        itinerary._id ||
                        "N/A"}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;
