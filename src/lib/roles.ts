import yaml from "yaml";

import { USER_PERMISSIONS_FILE } from "./../constants";
import { GHUser } from "../sharedTypes";
import { readFileSync } from "fs";

export function getRolesByUser(user: GHUser): Array<string> {
  const userEmails = user.emails.map((e) => e.value);
  let roles: Array<string> = [];
  try {
    const yamlFileContents = readFileSync(USER_PERMISSIONS_FILE).toString(
      "utf-8"
    );
    const rolesMap = yaml.parse(yamlFileContents) as Array<{
      email: string;
      roles: Array<string>;
    }>;
    roles = rolesMap.find((e) => userEmails.includes(e.email))?.roles ?? [];
  } catch (err) {
    //swallow
    console.log(err);
  }
  return roles;
}
