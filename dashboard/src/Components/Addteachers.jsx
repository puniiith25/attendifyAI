import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'

const AddTeacher = ({ setshowAddTeacher }) => {
    const [branch, setBranch] = useState("");
    const [year, setyear] = useState("");
    const mockSubjects = ['Data Structures', 'Database Systems', 'Algorithms', 'Computer Networks', 'Operating Systems'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    return (
        <div className='absolute inset-0 z-90 w-full h-full  backdrop-blur-md grid'>
            <div className='place-self-center w-160 border-2 bg-[#ffffff] rounded-2xl p-10'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='font-semibold text-4xl text-blue-950'>Add New Teacher</h1>
                        <p className=' text-gray-500 text-[18px]'>Enter teacher details to create a new profile</p>
                    </div>
                    <X onClick={() => setshowAddTeacher(false)} className='cursor-pointer h-14 w-10' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Full Name</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='Dr. John Smith' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Email</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='teacher@edu.com' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Password</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='Password' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Employe Id</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='EP0025' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Subjects</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='subjects (comma separated)' />
                </div>
                <div className=' relative flex flex-col mt-3'>
                    <label className='font-semibold ml-1'>Department</label>
                    <div className=' border-0 p-3  w-full  rounded bg-gray-200'>
                        <select className='appearance-none outline-0 w-full cursor-pointer' value={branch} onChange={(e) => setBranch(e.target.value)}>
                            <option value="">Choose Department</option>
                            {mockSubjects.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute z-4 text-gray-600 right-3 top-9 cursor-pointer " />

                    </div>
                </div>

                <div className='w-full flex gap-4 justify-end mt-10 '>
                    <button className='border-2 p-2 rounded-2xl w-35 text-2xl bg-gray-200 cursor-pointer' onClick={() => setshowAddTeacher(false)}> cancel</button>
                    <button className='border-2 p-2 rounded-2xl w-50 text-2xl flex  justify-center bg-blue-950 text-center text-white cursor-pointer'>+ Add Teacher</button>
                </div>


            </div>
        </div>
    )
}

export default AddTeacher