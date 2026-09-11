   import { useEffect, useState } from "react";
import API from "../services/api";


function Destinations() {

    const [destinations, setDestinations] = useState([]);


    useEffect(() => {
        fetchDestinations();
    }, []);


    const fetchDestinations = async () => {

        try {

            const response = await API.get("/destinations");

            setDestinations(response.data);

        } catch (error) {

            console.log("Error fetching destinations:", error);

        }

    };


    return (
        <div>

            <h1>Travel Destinations 🌍</h1>


            {
                destinations.length === 0 ? (

                    <p>No destinations available</p>

                ) : (

                    destinations.map((destination) => (

                        <div key={destination.id}>

                            <h2>{destination.name}</h2>

                            <p>
                                Country: {destination.country}
                            </p>

                            <p>
                                Category: {destination.category}
                            </p>

                            <p>
                                {destination.description}
                            </p>

                            <hr />

                        </div>

                    ))

                )
            }


        </div>
    );
}


export default Destinations;