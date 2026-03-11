import { Edit, Search, Trash2 } from "lucide-react"
import React, { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext"

const ClassRoom = ({ setshowAddClassroom }) => {

    const { classrooms = [] } = useContext(AppContext);

    const [search, setSearch] = useState("")

    const filteredClassrooms = classrooms.filter((item) =>
        item.room_number.toLowerCase().includes(search.toLowerCase())
    )

    return (

        <div className='border-2 mt-3 rounded p-6 border-gray-300'>

            <h1 className='font-semibold text-2xl'>
                Classroom Management
            </h1>

            <p className='text-gray-500'>
                Create and manage classrooms
            </p>


            {/* Search + Add */}

            <div className='flex justify-between'>

                <div className='border-0 rounded w-68 flex p-3 mt-4 items-center bg-gray-200'>

                    <Search className='h-5 w-5 text-gray-500' />

                    <input
                        type="text"
                        placeholder='Search classroom...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='ml-2 border-0 bg-transparent focus:outline-none'
                    />

                </div>


                <div className='rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>

                    <button
                        className='font-semibold'
                        onClick={() => setshowAddClassroom(true)}
                    >
                        + Add Classroom
                    </button>

                </div>

            </div>



            {/* Table */}

            <div className='border-2 border-gray-300 mt-10 p-4 rounded'>

                <div className='grid grid-cols-[1fr_1fr_0.5fr_0.3fr_0.3fr] border-b-2 border-gray-400 p-2 ml-3 font-semibold text-[14px]'>

                    <p>Room No</p>
                    <p>Building</p>
                    <p>Capacity</p>
                    <p>Edit</p>
                    <p>Delete</p>

                </div>


                {filteredClassrooms.length === 0 && (

                    <p className="text-gray-500 p-4 text-center">
                        No classrooms found
                    </p>

                )}


                {filteredClassrooms.map((item) => (

                    <div
                        key={item.id}
                        className='grid grid-cols-[1fr_1fr_0.5fr_0.3fr_0.3fr] border-b text-gray-500 border-gray-300 m-4 items-center pb-2'
                    >

                        <p className='font-semibold text-[13px]'>
                            {item.room_number}
                        </p>

                        <p className='text-[13px]'>
                            {item.building}
                        </p>

                        <p className='text-[13px]'>
                            {item.capacity}
                        </p>

                        <Edit className='cursor-pointer h-4 w-6 text-blue-600' />

                        <Trash2 className='cursor-pointer h-4 w-6 text-red-600' />

                    </div>

                ))}

            </div>

        </div>

    )

}

export default ClassRoom