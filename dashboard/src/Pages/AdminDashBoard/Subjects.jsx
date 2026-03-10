import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useContext } from 'react'
import { AppContext } from '../../Context/AppContext.jsx'

const Subjects = ({ setshowAddSubject }) => {

    const subjects = [

        {
            id: 1,
            subject_name: "Data Structures",
            subject_code: "CS201",
            department: "CSE",
            semester: "3"
        },

        {
            id: 2,
            subject_name: "Database Systems",
            subject_code: "CS301",
            department: "CSE",
            semester: "4"
        },

        {
            id: 3,
            subject_name: "Operating Systems",
            subject_code: "CS302",
            department: "CSE",
            semester: "4"
        }

    ]

    return (

        <div className='border-2 mt-3 rounded p-6 border-gray-300'>

            <h1 className='font-semibold text-2xl'>Subject Management</h1>
            <p className='text-gray-500'>
                Create and manage subjects for each department and semester
            </p>

            <div className='flex justify-between'>

                <div className='border-0 rounded w-68 flex p-3 mt-4 items-center bg-gray-200'>

                    <Search className='h-5 w-5 text-gray-500' />

                    <input
                        type="text"
                        placeholder='Search subjects...'
                        className='ml-2 border-0 focus:outline-none bg-transparent'
                    />

                </div>

                <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>

                    <button
                        type="button"
                        className='font-semibold'
                        onClick={() => setshowAddSubject(true)}
                    >
                        + Add Subject
                    </button>

                </div>

            </div>


            {/* Table */}

            <div className='border-2 border-gray-300 mt-15 p-4 rounded'>

                <div className='grid grid-cols-[1fr_1fr_1fr_1fr_0.3fr_0.3fr] border-b-2 border-gray-400 p-2 ml-3 font-semibold text-[14px]'>

                    <p>Subject Name</p>
                    <p>Subject Code</p>
                    <p>Department</p>
                    <p>Semester</p>
                    <p>Edit</p>
                    <p>Delete</p>

                </div>

                {subjects.map((item) => (

                    <div
                        key={item.id}
                        className='grid grid-cols-[1fr_1fr_1fr_1fr_0.3fr_0.3fr] border-b text-gray-500 border-gray-300 m-4 items-center pb-2'
                    >

                        <p className='font-semibold text-[13px]'>{item.subject_name}</p>

                        <p className='text-[13px]'>{item.subject_code}</p>

                        <p className='text-[13px]'>{item.department}</p>

                        <p className='text-[13px]'>{item.semester}</p>

                        <Edit className='cursor-pointer h-4 w-6' />

                        <Trash2 className='cursor-pointer h-4 w-6' />

                    </div>

                ))}

            </div>

        </div>

    )

}

export default Subjects