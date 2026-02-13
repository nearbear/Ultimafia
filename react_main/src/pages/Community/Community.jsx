import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Forums from "./Forums/Forums";
import UserSearch from "./UserSearch";
import Calendar from "./Calendar";
import Reports from "./Reports";
import { UserContext } from "../../Contexts";

export default function Community() {
  return (
    <Routes>
      <Route path="forums/*" element={<Forums />} />
      <Route path="users" element={<UserSearch />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="*" element={<Navigate to="forums" />} />
    </Routes>
  );
}
