import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TeacherDashBoard from './Pages/TeacherDashBoard'
import AttendancePage from './Pages/AttendancePage'
import T_TimetablePage from './Pages/TimetablePage'
import SettingsPage from './Pages/SettingsPage'
import NotificationPage from './Pages/NotificationPage'
import LoginPage from './Components/LoginPage'
import RouteProtecter from './Middleware/RouteProtecter'
import RouteLayout from './Layout/RouteLayout'
import TReportPage from './Pages/TReportPage'
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <RouteProtecter>
          <RouteLayout />
        </RouteProtecter>
      } >
        <Route index element={<TeacherDashBoard />} />
        <Route path="attendance" element={<AttendancePage />} />


        <Route path="timetable" element={<T_TimetablePage />} />

        <Route path="reports" element={<TReportPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App