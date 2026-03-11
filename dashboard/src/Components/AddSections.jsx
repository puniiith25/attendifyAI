import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const AddSections = ({ setshowAddSection }) => {
    const { teachers } = useContext(AppContext);
    const [form, setForm] = useState({
        sec_name: "",
        department: "",
        semester: "",
        capacity: "",
        class_teacher: 0
    });

    const mockDepartments = [
        "CSE",
        "ECE",
        "ME",
        "Civil",
        "AI & DS"
    ];


    const years = [
        "1st sem",
        "2nd sem",
        "3rd sem",
        "4th sem",
        "5th sem",
        "6th sem",
        "7th sem",
        "8th sem"
    ];

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async () => {

        try {

            const res = await axios.post(
                "http://localhost:8000/api/v1/sections/create-sec",
                form,
                {
                    withCredentials: true
                }
            );

            alert(res.data.message);

            setshowAddSection(false);

        } catch (error) {

            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    return (
        <div className="absolute inset-0 z-90 w-full h-full backdrop-blur-md grid">

            <div className="place-self-center w-140 border-2 bg-white rounded-2xl p-10">

                {/* Header */}

                <div className="flex justify-between">

                    <div>
                        <h1 className="font-semibold text-4xl text-blue-950">
                            Add New Section
                        </h1>

                        <p className="text-gray-500 text-[18px]">
                            Enter Section details to create
                        </p>
                    </div>

                    <X
                        onClick={() => setshowAddSection(false)}
                        className="cursor-pointer h-14 w-10"
                    />

                </div>


                {/* Section Name */}

                <div className="mt-5">

                    <h3 className="font-semibold ml-1">Section Name</h3>

                    <input
                        type="text"
                        name="sec_name"
                        value={form.sec_name}
                        onChange={handleChange}
                        className="border-0 p-3 w-full rounded bg-gray-200"
                        placeholder="CSE1A"
                    />

                </div>


                {/* Department */}

                <div className="relative flex flex-col mt-3">

                    <label className="font-semibold ml-1">
                        Department
                    </label>

                    <div className="border-0 p-3 w-full rounded bg-gray-200">

                        <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="appearance-none outline-0 w-full cursor-pointer"
                        >

                            <option value="">
                                Choose Department
                            </option>

                            {mockDepartments.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}

                        </select>

                        <ChevronDown className="absolute right-3 top-9 text-gray-600" />

                    </div>

                </div>


                {/* Semester */}

                <div className="relative flex flex-col mt-3">

                    <label className="font-semibold ml-1">
                        Semester
                    </label>

                    <div className="border-0 p-3 w-full rounded bg-gray-200">

                        <select
                            name="semester"
                            value={form.semester}
                            onChange={handleChange}
                            className="appearance-none outline-0 w-full cursor-pointer"
                        >

                            <option value="">
                                Select Semester
                            </option>

                            {years.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}

                        </select>

                        <ChevronDown className="absolute right-3 top-9 text-gray-600" />

                    </div>

                </div>


                {/* Capacity */}

                <div className="mt-5">

                    <h3 className="font-semibold ml-1">
                        Capacity
                    </h3>

                    <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        className="border-0 p-3 w-full rounded bg-gray-200"
                        placeholder="Enter capacity"
                    />

                </div>


                {/* Class Teacher */}

                <div className="relative flex flex-col mt-3">

                    <label className="font-semibold ml-1">
                        Class Teacher
                    </label>

                    <div className="border-0 p-3 w-full rounded bg-gray-200">

                        <select
                            name="class_teacher"
                            value={form.class_teacher}
                            onChange={handleChange}
                            className="appearance-none outline-0 w-full cursor-pointer"
                        >

                            <option value="">
                                Select Class Teacher
                            </option>

                            {teachers.map((item, index) => (
                                <option key={item.teacher_id} value={item.teacher_id}>
                                    {item.name}
                                </option>
                            ))}

                        </select>

                        <ChevronDown className="absolute right-3 top-9 text-gray-600" />

                    </div>

                </div>


                {/* Buttons */}

                <div className="w-full flex gap-4 justify-end mt-10">

                    <button
                        className="border-2 p-2 rounded-2xl w-35 text-2xl bg-gray-200 cursor-pointer"
                        onClick={() => setshowAddSection(false)}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="border-2 p-2 rounded-2xl w-50 text-2xl bg-blue-950 text-white cursor-pointer"
                    >
                        + Add Section
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AddSections;