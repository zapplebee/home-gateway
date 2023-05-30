import React from "react";
import { useProfileImage } from "./../lib/react";
import { Icon } from "./Icon";

export function Nav() {
  const imageUrl = useProfileImage();

  let Foo;

  if (!imageUrl) {
    Foo = <Icon name={"regular/chess-bishop"} />;
  } else {
    Foo = <img className="h-12 w-12" src={imageUrl}></img>;
  }
  return (
    <nav className="h-12 bg-blue-700  inline-flex items-center w-full gap-4">
      <a className="h-12 inline-flex items-center bg-blue-500" href="/account">
        {Foo} <span className="px-8">Account</span>
      </a>
      <a className="h-12 inline-flex items-center bg-blue-500" href="/logout">
        <span className="px-8">Logout</span>
      </a>
    </nav>
  );
}
