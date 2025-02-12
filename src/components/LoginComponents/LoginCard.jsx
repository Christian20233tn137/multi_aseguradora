import React from "react";
import LoginForm from "./LoginForm";

const LoginCard = ({ handleSubmit }) => {
  return (
    <div className="w-full in-h-screen p-8 bg-white">
      <div className="text-center">
        <h3 className=" text-2xl font-semibold">Inicio de Sesión</h3>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginCard;
