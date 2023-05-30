import React from "react";
import { useProfileImage, useUser } from "../lib/react";

export const Main: React.FunctionComponent<{}> = function Main() {
  const image = useProfileImage();
  const foo = useUser();

  return (
    <>
      <h2>Welcome {foo.displayName}</h2>
      {image ? <img className="rounded-full h-24 w-24" src={image} /> : null}
    </>
  );
};
