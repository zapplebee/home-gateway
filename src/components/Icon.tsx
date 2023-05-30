import React from "react";
import fs from "node:fs";
import path from "node:path";

export const Icon = ({ name }: { name: string }) => {
  try {
    const p = require.resolve(`@fortawesome/fontawesome-free/svgs/${name}.svg`);
    const content = fs.readFileSync(p).toString("utf-8");
    //@ts-ignore
    return (
      <span
        className="w-4 h-4"
        dangerouslySetInnerHTML={{ __html: content }}
      ></span>
    );
  } catch (err) {
    return <span className="w-4 h-4 mr-2">🫣</span>;
  }
};
