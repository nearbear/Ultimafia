import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Forums from "./Forums/Forums";
import UserSearch from "./UserSearch";
import Moderation from "./Moderation";
import Calendar from "./Calendar";
import Reports from "./Reports";

export default function Community() {
  return (
    <Routes>
      <Route path="forums/*" element={<Forums />} />
      <Route path="users" element={<UserSearch />} />
      <Route path="moderation" element={<Moderation />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="reports/:reportId" element={<Reports />} />
      <Route path="reports" element={<Reports />} />
      <Route path="*" element={<Navigate to="forums" />} />
    </Routes>
  );
}
