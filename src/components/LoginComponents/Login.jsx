import React, { useState } from "react"; // Agrega useState
import "../../index.css";
import "../LoginComponents/assets/login.css";
import LoginCard from "./LoginCard";
import RecruimentSection from "./RecruimentSection";

const Login = () => {
  const [user, setUser] = useState(null);

  return (
    <section>
      <div className="w-screen h-screen grid grid-rows-2 md:grid-cols-12">
        <div className="centered w-full h-full bg-white md:h-screen md:col-span-5">
          <LoginCard setUser={setUser} />
        </div>
        <div className="centered w-full h-full md:h-screen md:col-span-7 bg-[url('/src/components/LoginComponents/assets/Fondo.jpg')] bg-no-repeat bg-cover bg-center">
          <RecruimentSection />
        </div>
      </div>
    </section>
  );
};

export default Login;
