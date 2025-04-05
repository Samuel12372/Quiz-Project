import { createContext, useState, useContext } from "react";

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [isAnimated, setIsAnimated] = useState(true); // Default to animated background

  return (
    <BackgroundContext.Provider value={{ isAnimated, setIsAnimated }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);