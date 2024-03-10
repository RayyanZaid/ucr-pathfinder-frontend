import api from "../api";

const getShortestPath = async (coords, classBuildingName, roomName) => {
  let nodes = null;
  let edges = null;
  let minutesNeeded = null;
  let distance = null;

  try {
    const response = await api.get("/getShortestPath", {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        classBuildingName,
        roomName,
      },
    });
    if (response) {
      nodes = response.data["nodes"];
      edges = response.data["edges"];
      minutesNeeded = Math.ceil(response.data["totalTime"]);
      distance = Math.ceil(response.data["totalLength"]);
    }
  } catch (error) {
    console.error("Error fetching navigation data:", error);
  }

  return {
    nodes: nodes,
    edges: edges,
    minutesNeeded: minutesNeeded,
    distance: distance,
  };
};

export { getShortestPath };
