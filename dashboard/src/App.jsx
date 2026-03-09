import React, { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import DashBoard from "./Pages/AdminDashBoard/DashBoard";
import Teachers from "./Pages/AdminDashBoard/Teachers";
import Students from "./Pages/AdminDashBoard/Students";
import Sections from "./Pages/AdminDashBoard/Sections";
import TimeTables from "./Pages/AdminDashBoard/TimeTables";
import Reports from "./Pages/AdminDashBoard/Reports";
import Notifications from "./Pages/AdminDashBoard/Notifications";
import Settings from "./Pages/AdminDashBoard/Settings";
import Layout from "./Layout/Layout";
import AddStudents from "./Components/AddStudents";
import AddTeacher from "./Components/Addteachers";
import LoginPage from "./Components/LoginPage";
import ProtectedRoute from "./middleware/ProtectionRoute";
import AddSections from "./Components/AddSections";
const App = () => {
  const [showAddStudent, setshowAddStudent] = useState(false);
  const [showAddteacher, setshowAddTeacher] = useState(false);
  const [showAddSection, setshowAddSection] = useState(false);

  return (
    <div >


      {showAddStudent ? <AddStudents setshowAddStudent={setshowAddStudent} /> : <></>}
      {showAddteacher ? <AddTeacher setshowAddTeacher={setshowAddTeacher} /> : <></>}
      {showAddSection ? <AddSections setshowAddSection={setshowAddSection} /> : <></>}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } >
          <Route index element={<DashBoard />} />
          <Route path="students" element={<Students setshowAddStudent={setshowAddStudent} />} />


          <Route path="teachers" element={<Teachers setshowAddTeacher={setshowAddTeacher} />} />
          <Route path="sections" element={<Sections setshowAddSection={setshowAddSection} />} />
          <Route path="timetable" element={<TimeTables />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
