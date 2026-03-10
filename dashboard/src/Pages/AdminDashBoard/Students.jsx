import { Edit, Search, Trash2 } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '../../Context/AppContext'
import avatar from '../../assets/images/default-avatar-profile.jpg'



const Students = ({ setshowAddStudent }) => {
    const { students } = useContext(AppContext);
    return (
        <div className=' border-2 mt-3 rounded p-6 border-gray-300'>
            <h1 className='font-semibold text-2xl'>Student Management </h1>
            <p className='text-gray-500'>Manage students profiles, enrollment, and academic information</p>
            <div className='flex justify-between'>
                <div className='border-0 rounded w-68 flex p-3 mt-4 items-center bg-gray-200'>
                    <Search className='h-5 w-5 text-gray-500' />
                    <input type="text" name="search" placeholder='Search students...' className='ml-2 border-0 focus:outline-none' />
                </div>
                <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>
                    <button type="button" className='font-semibold cursor-pointer' onClick={() => setshowAddStudent(true)} >+Add Student</button>
                </div>
            </div>
            <div className="border border-gray-300 mt-10 rounded overflow-hidden">

                {/* Header */}
                <div className="grid grid-cols-8 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
                    <p>Avatar</p>
                    <p>Name</p>
                    <p>Roll Number</p>
                    <p>Branch</p>
                    <p>Semester</p>
                    <p>Section</p>
                    <p>Email</p>
                    <p className="text-center">Action</p>
                </div>

                {/* Rows */}
                {students.map((item) => (
                    <div
                        key={item.student_id}
                        className="grid grid-cols-8 px-6 py-3 items-center border-t text-sm text-gray-600 hover:bg-gray-50"
                    >
                        {item.image_url ? (<div>

                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover border"
                            />

                        </div>) : (<div>

                            <img
                                src={avatar}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover border"
                            />

                        </div>)}

                        <p className="font-medium text-gray-800">{item.name}</p>

                        <p>{item.roll_number}</p>

                        <p>{item.branch}</p>

                        <p>{item.semester}</p>

                        <p>{item.section}</p>

                        <p className="text-xs">{item.email}</p>

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

export default Students