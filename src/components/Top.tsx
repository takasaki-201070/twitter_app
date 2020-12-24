import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import Feed from "./Feed";
import AuthVerified from "./AuthVerified";

const Top: React.FC = () => {
  const user = useSelector(selectUser);

  return <> {user.emailVerified ? <Feed /> : <AuthVerified />}</>;
};

export default Top;
