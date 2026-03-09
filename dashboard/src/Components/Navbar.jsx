import { Bell } from 'lucide-react'
import React from 'react'

const Navbar = () => {
    return (
        <div className='top-0 p-4 items-center justify-between left-74 px-10 right-0 h-20 bg-white border-b fixed z-50 border-gray-500 flex'>

            <h1 className='text-2xl font-semibold'>Attend QR!</h1>
            <Bell className='h-8 w-7' />

        </div>
    )
}

export default Navbar