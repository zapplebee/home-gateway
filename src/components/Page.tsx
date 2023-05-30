import React from "react";
import { useUser } from "./../lib/react";
import { Nav } from "./Nav";

export const Page = function Page({
  title,
  children,
}: {
  title: string;
  children?: React.ReactElement<any>;
}): React.ReactElement {
  const user = useUser();

  return (
    <html>
      <head>
        <title>{title}</title>
        <link href="/wobble/output.css" rel="stylesheet" />
      </head>
      <body
        className="min-h-screen min-w-screen bg-contain md:bg-auto bg-right-bottom bg-fixed bg-no-repeat"
        style={{ backgroundImage: 'url("/wobble/heron.jpg")' }}
      >
        {user ? <Nav /> : null}
        {children}
      </body>
    </html>
  );
};
