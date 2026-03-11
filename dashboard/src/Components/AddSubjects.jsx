import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'
import axios from "axios"

const AddSubjects = ({ setshowAddSubject }) => {

    const [name, setName] = useState("")
    const [code, setCode] = useState("")
    const [department, setDepartment] = useState("")
    const [semester, setSemester] = useState("")

    const departments = [
        "CSE",
        "ECE",
        "ME",
        "Civil",
        "AI & DS"
    ]

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

    const handleSubmit = async () => {

        if (!name || !code || !department || !semester) {
            alert("All fields required")
            return
        }

        try {

            const res = await axios.post(
                "http://localhost:8000/api/v1/subjects/create-subject",
                {
                    name: name,
                    code: code,
                    department: department,
                    semester: Number(semester)
                },
                {
                    withCredentials: true
                }
            )

            console.log(res.data)

            if (res.data.success) {
                alert("Subject Created Successfully")
                setshowAddSubject(false)
            }

        } catch (error) {

            console.error(error)

            alert(error.response?.data?.message || "Something went wrong")

        }

    }

    return (

        <div className='absolute inset-0 z-90 w-full h-full backdrop-blur-md grid'>

            <div className='place-self-center w-120 border bg-white rounded-2xl p-8'>

                {/* Header */}

                <div className='flex justify-between'>

                    <h1 className='font-semibold text-3xl text-blue-950'>
                        Add New Subject
                    </h1>

                    <X
                        onClick={() => setshowAddSubject(false)}
                        className='cursor-pointer'
                    />

                </div>


                {/* Subject Name */}

                <div className='mt-5'>

                    <label className='text-sm font-semibold'>Subject Name</label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none'
                        placeholder='Data Structures'
                    />

                </div>


                {/* Subject Code */}

                <div className='mt-4'>

                    <label className='text-sm font-semibold'>Subject Code</label>

                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none'
                        placeholder='CS301'
                    />

                </div>


                {/* Department */}

                <div className='mt-4'>

                    <label className='text-sm font-semibold'>Department</label>

                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none'
                    >

                        <option value="">Select Department</option>

                        {departments.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}

                    </select>

                </div>


                {/* Semester */}

                <div className='mt-4'>

                    <label className='text-sm font-semibold'>Semester</label>

                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200 outline-none'
                    >

                        <option value="">Select Semester</option>

                        {semesters.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}

                    </select>

                </div>


                {/* Buttons */}

                <div className='flex justify-end gap-4 mt-8'>

                    <button
                        className='bg-gray-200 px-6 py-2 rounded'
                        onClick={() => setshowAddSubject(false)}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className='bg-blue-950 text-white px-6 py-2 rounded'
                    >
                        + Add Subject
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AddSubjects