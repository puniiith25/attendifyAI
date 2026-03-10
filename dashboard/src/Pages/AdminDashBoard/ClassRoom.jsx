import { Edit, Search, Trash2 } from "lucide-react"
import React from "react"

const ClassRoom = ({ setshowAddClassroom }) => {

    const classrooms = [
        {
            id: 1,
            room_no: "A101",
            building: "Block A",
            capacity: 60
        },
        {
            id: 2,
            room_no: "A102",
            building: "Block A",
            capacity: 60
        },
        {
            id: 3,
            room_no: "LAB1",
            building: "Lab Block",
            capacity: 40
        }
    ]

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
                        className='ml-2 border-0 bg-transparent focus:outline-none'
                    />

                </div>


                <div className='border-0 rounded w-50 flex justify-center mt-4 bg-blue-950 text-white cursor-pointer'>

                    <button
                        className='font-semibold'
                        onClick={() => setshowAddClassroom(true)}
                    >
                        + Add Classroom
                    </button>

                </div>

            </div>



            {/* Table */}

            <div className='border-2 border-gray-300 mt-15 p-4 rounded'>

                <div className='grid grid-cols-[1fr_1fr_0.5fr_0.3fr_0.3fr] border-b-2 border-gray-400 p-2 ml-3 font-semibold text-[14px]'>

                    <p>Room No</p>
                    <p>Building</p>
                    <p>Capacity</p>
                    <p>Edit</p>
                    <p>Delete</p>

                </div>



                {classrooms.map((room) => (

                    <div
                        key={room.id}
                        className='grid grid-cols-[1fr_1fr_0.5fr_0.3fr_0.3fr] border-b text-gray-500 border-gray-300 m-4 items-center pb-2'
                    >

                        <p className='font-semibold text-[13px]'>
                            {room.room_no}
                        </p>

                        <p className='text-[13px]'>
                            {room.building}
                        </p>

                        <p className='text-[13px]'>
                            {room.capacity}
                        </p>

                        <Edit className='cursor-pointer h-4 w-6' />

                        <Trash2 className='cursor-pointer h-4 w-6' />

                    </div>

                ))}

            </div>

        </div>

    )

}

export default ClassRoom