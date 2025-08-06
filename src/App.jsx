import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes/routes.jsx";

const App = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default App;
