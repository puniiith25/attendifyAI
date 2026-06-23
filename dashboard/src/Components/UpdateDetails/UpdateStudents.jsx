import { X } from "lucide-react"
import React, { useContext, useState } from "react"
import axios from "axios"
import { AppContext } from "../../Context/AppContext"
import { useEffect } from "react"

const UpdateStudents = ({ setshowUpdateStudent, id }) => {
    const { sections, getStudentByid, studentByid } = useContext(AppContext)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id) {
            getStudentByid(id);
        }
    }, [id]);
    useEffect(() => {

        if (studentByid) {

            setForm({
                name: studentByid.name || "",
                email: studentByid.email || "",

                roll_number: studentByid.roll_number || "",
                phone: studentByid.phone || "",
                admission_year: studentByid.admission_year || "",
                branch: studentByid.branch || "",
                semester: studentByid.semester || 0,
                section_id: studentByid.section_id || 0
            });

            setPreview(studentByid.image_url);

        }

    }, [studentByid]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        roll_number: "",
        phone: "",
        admission_year: "",
        branch: "",
        semester: 0,
        section_id: 0
    })

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const branches = ["CSE", "ECE", "ME", "Civil", "AI & DS"]

    const semesters = [
        { value: 1, label: "1st Sem" },
        { value: 2, label: "2nd Sem" },
        { value: 3, label: "3rd Sem" },
        { value: 4, label: "4th Sem" },
        { value: 5, label: "5th Sem" },
        { value: 6, label: "6th Sem" },
        { value: 7, label: "7th Sem" },
        { value: 8, label: "8th Sem" }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value ? Number(value) : 0
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            roll_number: "",
            phone: "",
            admission_year: "",
            branch: "",
            semester: 0,
            section_id: 0
        })
        setImage(null)
        setPreview(null)
    }

    const handleSubmit = async () => {

        if (!form.name || !form.email  || !form.roll_number || !form.section_id) {
            alert("Please fill all required fields")
            return
        }

        try {

            setLoading(true)

            const formData = new FormData()

            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value)
            })

            if (image) formData.append("image", image)

            const res = await axios.put(
                `http://localhost:8000/api/v1/students/update-student/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            if (res.data.success) {

                resetForm()

                setshowUpdateStudent(false)

            }

        } catch (err) {

            console.error(err)

            alert(err.response?.data?.message || "Failed to Update student")

        } finally {

            setLoading(false)

        }

    }

    return (

        <div className="absolute inset-0 z-90 w-full h-full backdrop-blur-md grid">

            <div className="place-self-center w-140 border bg-white rounded-2xl p-8">

                <div className="flex justify-between">
                    <h1 className="font-semibold text-3xl text-blue-950">
                        Update Student
                    </h1>

                    <X
                        onClick={() => setshowUpdateStudent(false)}
                        className="cursor-pointer"
                    />
                </div>

                <div className="mt-6 flex items-center gap-4">

                    <div className="w-16 h-16 rounded-full overflow-hidden border">
                        {preview
                            ? <img src={preview} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">Photo</div>
                        }
                    </div>

                    <input type="file" accept="image/*" onChange={handleImageChange} />

                </div>

                <div className="mt-4">
                    <label className="text-sm font-semibold">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Email</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    />
                </div>

               

                <div className="mt-3">
                    <label className="text-sm font-semibold">Roll Number</label>
                    <input
                        name="roll_number"
                        value={form.roll_number}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Phone</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Admission Year</label>
                    <input
                        name="admission_year"
                        value={form.admission_year}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    />
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Section</label>
                    <select
                        name="section_id"
                        value={form.section_id}
                        onChange={handleNumberChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    >
                        <option value="">Select</option>
                        {sections.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.sec_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Branch</label>
                    <select
                        name="branch"
                        value={form.branch}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    >
                        <option value="">Select</option>
                        {branches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-3">
                    <label className="text-sm font-semibold">Semester</label>
                    <select
                        name="semester"
                        value={form.semester}
                        onChange={handleNumberChange}
                        className="py-2 px-3 w-full rounded bg-gray-200"
                    >
                        <option value="">Select</option>
                        {semesters.map(s => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        className="bg-gray-200 px-6 py-2 rounded"
                        onClick={() => setshowUpdateStudent(false)}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-950 text-white px-6 py-2 rounded"
                    >
                        {loading ? "Creating..." : "+ Add Student"}
                    </button>

                </div>

            </div>

        </div>

    )
}

export default UpdateStudents