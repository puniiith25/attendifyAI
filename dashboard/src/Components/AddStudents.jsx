import { ChevronDown, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import axios from "axios"
import { AppContext } from '../Context/AppContext';

const AddStudents = ({ setshowAddStudent }) => {
    const { sections } = useContext(AppContext);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [roll, setRoll] = useState("")
    const [phone, setPhone] = useState("")
    const [year, setYear] = useState("")

    const [branch, setBranch] = useState("")
    const [semester, setSemester] = useState("")
    const [section, setSection] = useState("")

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const sections_list = ['CSE-A', 'CSE-B', 'CSE-C', 'CSE-D', 'CSE-E']

    const Semister_list = [
        '1st \Sem', '2nd Sem', '3rd Sem', '4th Sem',
        '5th Sem', '6th Sem', '7th Sem', '8th Sem'
    ]

    const branches = [
        'CSE', 'ECE', 'ME', 'Civil', 'AI & DS'
    ]


    const handleImageChange = (e) => {

        const file = e.target.files[0]

        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }

    }


    const handleSubmit = async () => {

        try {

            const formData = new FormData()

            formData.append("name", name)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("roll_number", roll)
            formData.append("phone", phone)
            formData.append("admission_year", year)
            formData.append("branch", branch)
            formData.append("semester", semester)
            formData.append("section", section)

            if (image) {
                formData.append("image", image)
            }

            const res = await axios.post(
                "http://localhost:5000/api/students/create-student",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            console.log(res.data)

            setshowAddStudent(false)

        } catch (err) {

            console.error(err)

        }

    }


    return (

        <div className='absolute inset-0 z-90 w-full h-full backdrop-blur-md grid'>

            <div className='place-self-center w-140 border bg-white rounded-2xl p-8'>

                <div className='flex justify-between'>

                    <div>
                        <h1 className='font-semibold text-3xl text-blue-950'>
                            Add New Student
                        </h1>
                    </div>

                    <X
                        onClick={() => setshowAddStudent(false)}
                        className='cursor-pointer'
                    />

                </div>


                {/* Image Upload */}

                <div className='mt-6 flex items-center gap-4'>

                    <div className='w-16 h-16 rounded-full overflow-hidden border'>

                        {preview ? (

                            <img
                                src={preview}
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
                    />

                </div>


                {/* Name */}

                <div className='mt-4'>

                    <label className='text-sm font-semibold'>Name</label>

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Email */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Email</label>

                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Password */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Password</label>

                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Roll */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Roll Number</label>

                    <input
                        value={roll}
                        onChange={(e) => setRoll(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Phone */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Phone</label>

                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Admission */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Admission Year</label>

                    <input
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    />

                </div>


                {/* Section */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Section</label>

                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    >

                        <option value="">Select</option>

                        {sections.map((item, index) => (
                            <option key={item.section_id} value={item.section_id}>{item.sec_name}</option>
                        ))}

                    </select>

                </div>


                {/* Branch */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Branch</label>

                    <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    >

                        <option value="">Select</option>

                        {branches.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}

                    </select>

                </div>


                {/* Semester */}

                <div className='mt-3'>

                    <label className='text-sm font-semibold'>Semester</label>

                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className='py-2 px-3 w-full rounded bg-gray-200'
                    >

                        <option value="">Select</option>

                        {Semister_list.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}

                    </select>

                </div>


                {/* Buttons */}

                <div className='flex justify-end gap-4 mt-8'>

                    <button
                        className='bg-gray-200 px-6 py-2 rounded'
                        onClick={() => setshowAddStudent(false)}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className='bg-blue-950 text-white px-6 py-2 rounded'
                    >
                        + Add Student
                    </button>

                </div>

            </div>

        </div>
    )
}

export default AddStudents