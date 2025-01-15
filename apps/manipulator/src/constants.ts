export const webUrl =
  process.env.NODE_ENV === "production"
    ? "http://localhost:4000" // TODO: change this to the production domain
    : "http://localhost:4000";
