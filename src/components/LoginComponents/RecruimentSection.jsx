import React from "react";
import RecruimentStructure from "./RecruimentStructure";

const RecruimentSection = () => {
  return (
    <div className="flex items-center justify-center p-3">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">  
          <div className="md:col-start-4 md:col-span-6">
            <RecruimentStructure />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruimentSection;