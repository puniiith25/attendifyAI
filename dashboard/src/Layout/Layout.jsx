import React from 'react'
import Navbar from '../Components/Navbar'
import SideBar from '../Components/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className='flex flex-1 pt-16'>
                <SideBar />
                <main className='flex-1 ml-74  p-6 bg-[#F4F7FB] overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout