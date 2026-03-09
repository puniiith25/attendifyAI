import { Edit, Search, Trash2, UserPlus } from 'lucide-react'
import React from 'react'
import { section_list } from '../../assets/Sectiondata.js'
import { useNavigate } from 'react-router-dom'

const Sections = ({ setshowAddSection }) => {
    return (
        <div className=' border-2 mt-3 rounded p-6 border-gray-300'>
            <h1 className='font-semibold text-2xl'>Section Management </h1>
            <p className='text-gray-500'>Create and manage sections, assign students and teachers</p>
            <div className='flex justify-between'>
                <div className='border-0 rounded w-68 flex p-3 mt-4 items-center bg-gray-200'>
                    <Search className='h-5 w-5 text-gray-500' />
                    <input type="text" name="search" placeholder='Search students...' className='ml-2 border-0 focus:outline-none' />
                </div>
                <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>
                    <button type="button" className='font-semibold cursor-pointer' onClick={() => setshowAddSection(true)} >+ Create Section</button>
                </div>
            </div>
            <div className='border-2 border-gray-300 mt-15 p-4 rounded'>
                <div className='grid grid-cols-[0.5fr_0.7fr_0.7fr_0.7fr_0.8fr_0.4fr] border-b-2 border-gray-400 p-2 ml-3 font-semibold text-[14px]'>
                    <p>Section</p>
                    <p>Department</p>
                    <p>Year</p>
                    <p>Class Teacher</p>
                    <p>Enrollment</p>
                    <p>Action</p>
                </div>
                {section_list.map((item, index) => (
                    <div key={index} className='grid grid-cols-[0.4fr_0.8fr_0.7fr_0.8fr_0.5fr_0.2fr_0.2fr_0.2fr] border-b text-gray-500 border-gray-300 m-4 items-center    pb-2'>
                        <p className='font-semibold text-[12px]'>{item.section}</p>
                        <p className='text-[12px] ml-3'>{item.department}</p>
                        <p className='text-[12px]'>{item.year_course}</p>
                        <p className=' flex  align-middle text-[12px] ml-3'>{item.class_teacher}</p>
                        <p className=' flex text-[14px] ml-3'>{item.enrollment}</p>
                        <UserPlus className='cursor-pointer h-4 w-6' />
                        <Edit className='cursor-pointer h-4 w-6' />
                        <Trash2 className='cursor-pointer h-4 w-6' />
                    </div>
                ))}

            </div>
        </div>
    )

}

export default Sections