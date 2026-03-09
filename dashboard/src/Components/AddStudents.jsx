import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'

const AddStudents = ({ setshowAddStudent }) => {
    const [branch, setBranch] = useState("");
    const [Sem, setSem] = useState("");
    const mockSubjects = ['Data Structures', 'Database Systems', 'Algorithms', 'Computer Networks', 'Operating Systems'];
    const [section, setSection] = useState("");
    const sections_list = ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E'];
    const Semister_list = ['1st Sem', '2nd sem', '3rd sem', '4th sem', '5th Sem', '6th sem', '7th sem', '8th sem'];
    return (
        <div className='absolute inset-0 z-90 w-full h-full  backdrop-blur-md grid'>
            <div className='place-self-center w-140  border-2 bg-[#ffffff] rounded-2xl p-10'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='font-semibold text-4xl text-blue-950'>Add New Student</h1>
                        <p className=' text-gray-500 text-[18px]'>Enter student details to create a new profile</p>
                    </div>
                    <X onClick={() => setshowAddStudent(false)} className='cursor-pointer h-14 w-10' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Full Name</h3>
                    <input type="text" name="name" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='Enter student name' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Email</h3>
                    <input type="text" name="Email" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='student@edu.com' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Password</h3>
                    <input type="text" name="Password" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='Password' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Roll Number</h3>
                    <input type="text" name="Roll Number" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='CSE0025' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Phone Number</h3>
                    <input type="text" name="Phone Number" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='+91 961143****' />
                </div>
                <div className='mt-5'>
                    <h3 className='font-semibold ml-1'>Admission Year</h3>
                    <input type="text" name="Admission Year" className='border-0 p-3 w-full rounded bg-gray-200' placeholder='2024' />
                </div>
                <div className=' relative flex flex-col mt-3'>
                    <label className='font-semibold ml-1'>Select Section</label>
                    <div className=' border-0 p-3  w-full  rounded bg-gray-200'>
                        <select className='appearance-none outline-0 w-full cursor-pointer' value={section} onChange={(e) => setSection(e.target.value)}>
                            <option value="">section</option>
                            {sections_list.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute z-4 text-gray-600 right-3 top-9 cursor-pointer " />

                    </div>
                </div>
                <div className='flex columns-1 justify-between'>
                    <div className=' relative flex flex-col mt-3'>
                        <label className='font-semibold ml-1'>Select Branch</label>
                        <div className=' border-0 p-3  w-50  rounded bg-gray-200'>
                            <select className='appearance-none outline-0 w-full cursor-pointer' value={branch} onChange={(e) => setBranch(e.target.value)}>
                                <option value="">Branch</option>
                                {mockSubjects.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute z-4 text-gray-600 right-3 top-9 cursor-pointer " />

                        </div>
                    </div>
                    <div className=' relative flex flex-col mt-3'>
                        <label className='font-semibold ml-1'>Select Semister</label>
                        <div className=' border-0 p-3  w-50  rounded bg-gray-200'>
                            <select className='appearance-none outline-0 w-full cursor-pointer' value={Sem} onChange={(e) => setSem(e.target.value)}>
                                <option value="">Semister</option>
                                {Semister_list.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute z-4 text-gray-600 right-3 top-9 cursor-pointer " />

                        </div>
                    </div>
                </div>
                <div className='w-full flex gap-4 justify-end mt-10 '>
                    <button className='border-2 p-2 rounded-2xl w-35 text-2xl bg-gray-200 cursor-pointer' onClick={() => setshowAddStudent(false)}> cancel</button>
                    <button className='border-2 p-2 rounded-2xl w-50 text-2xl flex  justify-center bg-blue-950 text-center text-white cursor-pointer'>+ Add Student</button>
                </div>


            </div>
        </div>
    )
}

export default AddStudents