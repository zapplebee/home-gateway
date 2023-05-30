import React from "react";
import { useUser } from "../lib/react";
import { getRolesByUser } from "../lib/roles";

export const Account: React.FunctionComponent<{ data: any }> =
  function Account({ data = null }) {
    const user = useUser();
    const roles = getRolesByUser(user);
    return (
      <>
        <h1>Account</h1>
        <hr />
        <h2>Roles</h2>
        <pre>{JSON.stringify(roles, null, 2)}</pre>
        <hr />
        <h2>Repos</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    );
  };
