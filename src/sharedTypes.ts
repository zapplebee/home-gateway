export type GHUser = {
  id: string;
  nodeId: string;
  displayName: string;
  accessToken: string;
  username: string;
  profileUrl: string;
  emails: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  provider: "github";
};
