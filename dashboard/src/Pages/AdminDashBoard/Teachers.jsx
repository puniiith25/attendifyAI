import { Edit, Search, Trash2 } from 'lucide-react'
import React from 'react'
import { teacher_list } from '../../assets/TeacherData'

const Teachers = ({ setshowAddTeacher }) => {
  return (
    <div className='border-2 mt-3 rounded p-6 border-gray-300'>
      <h1 className='font-semibold text-2xl'>Teachers Management </h1>
      <p className='text-gray-500'>Manage facultys profile, subjects Assignments, and qualifications</p>
      <div className='flex justify-between'>
        <div className='border-0 rounded w-68 flex p-3 mt-4 items-center bg-gray-200'>
          <Search className='h-5 w-5 text-gray-500' />
          <input type="text" name="search" placeholder='Search teacher...' className='ml-2 border-0 focus:outline-none' />
        </div>
        <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>
          <button type="button" className='font-semibold cursor-pointer' onClick={() => setshowAddTeacher(true)}>+Add Teacher</button>
        </div>
      </div>
      <div className="border border-gray-300 mt-10 rounded overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-6 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
          <p>Name</p>
          <p>Employee ID</p>
          <p>Department</p>
          <p>Email</p>
          <p>Sections</p>
          <p className="text-center">Action</p>
        </div>

        {/* Rows */}
        {teacher_list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 px-6 py-3 items-center border-t text-sm text-gray-600 hover:bg-gray-50"
          >

            <p className="font-medium text-gray-800">{item.name}</p>

            <p>{item.employeeId}</p>

            <p>{item.department}</p>

            <p className="text-xs">{item.email}</p>

            {/* Sections */}
            <div className="relative group">

              <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                {item.sections[0]}
              </span>

              {item.sections.length > 1 && (
                <span className="ml-2 text-blue-600 text-xs cursor-pointer">
                  +{item.sections.length - 1}
                </span>
              )}

              <div className="absolute hidden group-hover:block bg-white border shadow-lg rounded p-2 mt-2 text-xs z-10">
                {item.sections.slice(1).map((sec, i) => (
                  <p key={i}>{sec}</p>
                ))}
              </div>

            </div>

            {/* Action */}
            <div className="flex justify-center gap-4">

              <Edit className="h-4 w-4 cursor-pointer text-blue-600 hover:scale-110" />

              <Trash2 className="h-4 w-4 cursor-pointer text-red-500 hover:scale-110" />

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Teachers