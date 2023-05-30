import React from "react";
import { Icon } from "./Icon";
export const Login = () => {
  return (
    <div className="p-12">
      <a
        className={
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center fill-white gap-4"
        }
        href="/auth/github"
      >
        <Icon name={"brands/github"} />
        <span>Login with GitHub</span>
      </a>
    </div>
  );
};
