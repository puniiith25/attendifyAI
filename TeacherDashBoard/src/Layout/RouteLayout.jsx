import React from 'react'
import NavbarPage from '../Components/Navbar'
import SidebarPage from '../Components/SideBarPage'
import { Outlet } from 'react-router-dom'
const RouteLayout = () => {
    return (
        <div className='flex flex-col h-screen'>
            <NavbarPage />
            <div className='flex flex-1 pt-16'>
                <SidebarPage />
                <main className='flex-1 ml-74  p-6 bg-[#F4F7FB] overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default RouteLayout