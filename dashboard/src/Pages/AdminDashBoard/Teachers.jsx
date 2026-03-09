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
          <input type="text" name="search" placeholder='Search students...' className='ml-2 border-0 focus:outline-none' />
        </div>
        <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>
          <button type="button" className='font-semibold cursor-pointer' onClick={() => setshowAddTeacher(true)}>+Add Teacher</button>
        </div>
      </div>
      <div className='border-2 border-gray-300 mt-15 p-4 rounded'>
        <div className='grid grid-cols-[0.5fr_0.6fr_0.8fr_0.8fr_0.7fr_0.7fr_0.3fr] border-b-2 border-gray-400 p-2 ml-3 font-semibold text-[14px]'>
          <p>Name</p>
          <p>Employe Id</p>
          <p>Department</p>
          <p>Subjects</p>
          <p>Email</p>
          <p>Sections</p>
          <p>Action</p>
        </div>
        {teacher_list.map((item, index) => (
          <div key={index} className='grid grid-cols-[0.6fr_0.6fr_0.9fr_0.8fr_0.95fr_0.8fr_0.2fr_0.15fr] border-b text-gray-500 border-gray-300 m-4 items-center text-start pb-2'>
            <p className='text-gray-700 font-semibold text-[12px]'>{item.name}</p>
            <p className='text-[13px]'>{item.employeeId}</p>
            <p className='text-[13px]'>{item.department}</p>
            <div className="relative group">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[9px] text-center">
                {item.subjects[0]}
              </span>
              {item.subjects.length > 1 && (
                <span className="ml-2 text-blue-600 text-[8px] cursor-pointer group-hover:underline">
                  +{item.subjects.length - 1} more
                </span>
              )}
              <div className="absolute hidden group-hover:block bg-white border p-2 shadow-lg mt-2 rounded text-xs z-10">
                {item.subjects.slice(1).map((subj, i) => (
                  <p key={i}>{subj}</p>
                ))}
              </div>
            </div>

            <p className='text-[12px]'>{item.email}</p>
            <div className="relative group">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px]">
                {item.sections[0]}
              </span>
              {item.sections.length > 1 && (
                <span className="ml-2 text-blue-600 text-[8px] cursor-pointer group-hover:underline">
                  +{item.sections.length - 1} more
                </span>
              )}
              <div className="absolute hidden group-hover:block bg-white border p-2 shadow-lg mt-2 rounded text-xs z-10">
                {item.sections.slice(1).map((subj, i) => (
                  <p key={i}>{subj}</p>
                ))}
              </div>
            </div>

            <Edit className='cursor-pointer w-6 h-4' />
            <Trash2 className='cursor-pointer w-6 h-4' />
          </div>
        ))}

      </div>
    </div>
  )
}

export default Teachers