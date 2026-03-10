import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'

const AddTeacher = ({ setshowAddTeacher }) => {

    const [branch, setBranch] = useState("")
    const [image, setImage] = useState(null)

    const Department = [
        "CSE",
        "ECE",
        "ME",
        "Civil",
        "AI & DS"
    ]

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(URL.createObjectURL(file))
        }
    }

    return (

        <div className='absolute inset-0 z-90 w-full h-full backdrop-blur-md grid'>

            <div className='place-self-center w-150 border bg-white rounded-2xl p-8'>

                {/* Header */}

                <div className='flex justify-between'>

                    <div>
                        <h1 className='font-semibold text-3xl text-blue-950'>
                            Add New Teacher
                        </h1>

                        <p className='text-gray-500'>
                            Enter teacher details to create profile
                        </p>
                    </div>

                    <X
                        onClick={() => setshowAddTeacher(false)}
                        className='cursor-pointer h-8 w-8'
                    />

                </div>


                {/* Image Picker */}

                <div className='mt-6 flex items-center gap-4'>

                    <div className='w-16 h-16 rounded-full overflow-hidden border'>

                        {image ? (
                            <img
                                src={image}
                                alt="preview"
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full h-full bg-gray-200 flex items-center justify-center text-xs'>
                                Photo
                            </div>
                        )}

                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className='text-sm bg-gray-300 p-1 pl-2 w-45 rounded '
                    />

                </div>


                {/* Name */}

                <div className='mt-4'>
                    <label className='font-semibold text-sm'>Full Name</label>

                    <input
                        type="text"
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm'
                        placeholder='Dr. John Smith'
                    />
                </div>


                {/* Email */}

                <div className='mt-3'>
                    <label className='font-semibold text-sm'>Email</label>

                    <input
                        type="text"
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm'
                        placeholder='teacher@edu.com'
                    />
                </div>


                {/* Password */}

                <div className='mt-3'>
                    <label className='font-semibold text-sm'>Password</label>

                    <input
                        type="text"
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm'
                        placeholder='Password'
                    />
                </div>


                {/* Employee ID */}

                <div className='mt-3'>
                    <label className='font-semibold text-sm'>Employee ID</label>

                    <input
                        type="text"
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm'
                        placeholder='EMP0025'
                    />
                </div>


                {/* Phone */}

                <div className='mt-3'>
                    <label className='font-semibold text-sm'>Phone Number</label>

                    <input
                        type="text"
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm'
                        placeholder='+91 961143****'
                    />
                </div>


                {/* Department */}

                <div className='relative mt-3'>

                    <label className='font-semibold text-sm'>Department</label>

                    <select
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm appearance-none'
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    >

                        <option value="">Choose Department</option>

                        {Department.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}

                    </select>

                    <ChevronDown className="absolute right-3 top-9 text-gray-600" />

                </div>


                {/* Buttons */}

                <div className='flex justify-end gap-4 mt-8'>

                    <button
                        className='bg-gray-200 px-6 py-2 rounded-lg'
                        onClick={() => setshowAddTeacher(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className='bg-blue-950 text-white px-6 py-2 rounded-lg'
                    >
                        + Add Teacher
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AddTeacher