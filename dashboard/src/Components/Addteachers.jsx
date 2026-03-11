import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

const AddTeacher = ({ setshowAddTeacher }) => {

    const [branch, setBranch] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        employee_number: "",
        phone: ""
    });

    const Department = [
        "CSE",
        "ECE",
        "ME",
        "Civil",
        "AI & DS"
    ];

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async () => {

        try {

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("employee_number", form.employee_number);
            formData.append("phone", form.phone);
            formData.append("department", branch);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await axios.post(
                "http://localhost:8000/api/v1/teachers/create-teacher",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert(res.data.message);

            setshowAddTeacher(false);

        } catch (error) {

            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    return (

        <div className="absolute inset-0 z-90 w-full h-full backdrop-blur-md grid">

            <div className="place-self-center w-150 border bg-white rounded-2xl p-8">

                {/* Header */}

                <div className="flex justify-between">

                    <div>
                        <h1 className="font-semibold text-3xl text-blue-950">
                            Add New Teacher
                        </h1>

                        <p className="text-gray-500">
                            Enter teacher details to create profile
                        </p>
                    </div>

                    <X
                        onClick={() => setshowAddTeacher(false)}
                        className="cursor-pointer h-8 w-8"
                    />

                </div>


                {/* Image Picker */}

                <div className="mt-6 flex items-center gap-4">

                    <div className="w-16 h-16 rounded-full overflow-hidden border">

                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                                Photo
                            </div>
                        )}

                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm bg-gray-300 p-1 pl-2 w-45 rounded"
                    />

                </div>


                {/* Name */}

                <div className="mt-4">
                    <label className="font-semibold text-sm">Full Name</label>

                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm"
                        placeholder="Dr. John Smith"
                    />
                </div>


                {/* Email */}

                <div className="mt-3">
                    <label className="font-semibold text-sm">Email</label>

                    <input
                        name="email"
                        type="text"
                        value={form.email}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm"
                        placeholder="teacher@edu.com"
                    />
                </div>


                {/* Password */}

                <div className="mt-3">
                    <label className="font-semibold text-sm">Password</label>

                    <input
                        name="password"
                        type="text"
                        value={form.password}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm"
                        placeholder="Password"
                    />
                </div>


                {/* Employee ID */}

                <div className="mt-3">
                    <label className="font-semibold text-sm">Employee ID</label>

                    <input
                        name="employee_number"
                        type="text"
                        value={form.employee_number}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm"
                        placeholder="EMP0025"
                    />
                </div>


                {/* Phone */}

                <div className="mt-3">
                    <label className="font-semibold text-sm">Phone Number</label>

                    <input
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm"
                        placeholder="+91 961143****"
                    />
                </div>


                {/* Department */}

                <div className="relative mt-3">

                    <label className="font-semibold text-sm">Department</label>

                    <select
                        className="py-2 px-3 w-full rounded bg-gray-200 outline-none text-sm appearance-none"
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

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        className="bg-gray-200 px-6 py-2 rounded-lg"
                        onClick={() => setshowAddTeacher(false)}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-950 text-white px-6 py-2 rounded-lg"
                    >
                        + Add Teacher
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AddTeacher;