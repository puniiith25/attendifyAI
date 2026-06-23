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
import AddTimeTable from "./Components/AddTimetable";
import Subjects from "./Pages/AdminDashBoard/Subjects";
import ClassRoom from "./Pages/AdminDashBoard/ClassRoom";
import AddSubjects from "./Components/AddSubjects";
import AddClassRoom from "./Components/AddClassRoom";
const App = () => {
  const [showAddteacher, setshowAddTeacher] = useState(false);
  const [showAddSection, setshowAddSection] = useState(false);
  const [showAddSubject, setshowAddSubject] = useState(false);
  const [showAddclassRoom, setshowAddClassroom] = useState(false);
  const [showAddTimeTable, setshowAddTimeTable] = useState(false);

  return (
    <div >



      {showAddteacher ? <AddTeacher setshowAddTeacher={setshowAddTeacher} /> : <></>}
      {showAddSection ? <AddSections setshowAddSection={setshowAddSection} /> : <></>}
      {showAddTimeTable ? <AddTimeTable setshowAddTimeTable={setshowAddTimeTable} /> : <></>}
      {showAddSubject ? <AddSubjects setshowAddSubject={setshowAddSubject} /> : <></>}
      {showAddclassRoom ? <AddClassRoom setshowAddClassroom={setshowAddClassroom} /> : <></>}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } >
          <Route index element={<DashBoard />} />
          <Route path="students" element={<Students />} />


          <Route path="teachers" element={<Teachers setshowAddTeacher={setshowAddTeacher} />} />
          <Route path="sections" element={<Sections setshowAddSection={setshowAddSection} />} />
          <Route path="subjects" element={<Subjects setshowAddSubject={setshowAddSubject} />} />
          <Route path="classroom" element={<ClassRoom setshowAddClassroom={setshowAddClassroom} />} />
          <Route path="timetable" element={<TimeTables setshowAddTimeTable={setshowAddTimeTable} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
