import { ChevronDown, X } from "lucide-react"
import React, { useState } from "react"

const AddClassRoom = ({ setshowAddClassroom }) => {

    const [roomNo, setRoomNo] = useState("")
    const [building, setBuilding] = useState("")
    const [capacity, setCapacity] = useState("")

    const buildings = [
        "Block A",
        "Block B",
        "Engineering Block",
        "Lab Block"
    ]

    return (

        <div className="absolute inset-0 z-90 w-full h-full backdrop-blur-md grid">

            <div className="place-self-center w-[500px] border bg-white rounded-2xl p-10">

                <div className="flex justify-between">

                    <div>
                        <h1 className="font-semibold text-3xl text-blue-950">
                            Add Classroom
                        </h1>

                        <p className="text-gray-500">
                            Create a new classroom
                        </p>
                    </div>

                    <X
                        onClick={() => setshowAddClassroom(false)}
                        className="cursor-pointer"
                    />

                </div>


                {/* Room No */}

                <div className="mt-6">

                    <label className="font-semibold ml-1">
                        Room No
                    </label>

                    <input
                        type="text"
                        value={roomNo}
                        onChange={(e) => setRoomNo(e.target.value)}
                        className="p-3 w-full rounded bg-gray-200 outline-none"
                        placeholder="A101"
                    />

                </div>


                {/* Building */}

                <div className="relative flex flex-col mt-5">

                    <label className="font-semibold ml-1">
                        Select Building
                    </label>

                    <div className="p-3 w-full rounded bg-gray-200">

                        <select
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            className="appearance-none outline-none w-full cursor-pointer"
                        >

                            <option value="">Building</option>

                            {buildings.map((item, index) => (
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

                    <label className="font-semibold ml-1">
                        Capacity
                    </label>

                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="p-3 w-full rounded bg-gray-200 outline-none"
                        placeholder="60"
                    />

                </div>


                {/* Buttons */}

                <div className="flex justify-end gap-4 mt-10">

                    <button
                        onClick={() => setshowAddClassroom(false)}
                        className="bg-gray-200 px-6 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        className="bg-blue-950 text-white px-6 py-2 rounded-lg"
                    >
                        + Add Classroom
                    </button>

                </div>

            </div>

        </div>

    )

}

export default AddClassRoom