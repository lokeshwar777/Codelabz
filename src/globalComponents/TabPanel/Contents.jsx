import React from "react";

const Contents = ({ children, active }) => {
  return (
    <div className="contents">
      {children.map((element, index) => {
        return (
          <div key={index} className={active === index ? "content active" : "content"}>
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default Contents;
