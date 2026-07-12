import { Check, X, Camera, User } from "lucide-react"

export default function StudentTable({ students = [], onUpdate }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-6 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Student Profile</div>
                <div className="col-span-3">AI Verification Proof</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Empty State */}
            {students.length === 0 && (
                <div className="p-10 text-center space-y-2">
                    <User className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-slate-400 font-medium">No students enrolled in this section</p>
                </div>
            )}

            {/* Student Rows */}
            <div className="divide-y divide-slate-100">
                {students.map((student, index) => {
                    const isPresent = student.status === "present"
                    const confidencePercent = student.confidence ? Math.round(student.confidence * 100) : null

                    return (
                        <div
                            key={student.id}
                            className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors duration-150"
                        >
                            {/* Roll number index */}
                            <div className="col-span-1 text-sm font-semibold text-slate-400">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            {/* Student Profile Info */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                                    <User className="w-5 h-5 absolute" />
                                    {student.photo && (
                                        <img
                                            src={student.photo}
                                            alt={student.name}
                                            className="w-full h-full object-cover absolute z-10"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {student.name}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        ID: {student.id}
                                    </p>
                                </div>
                            </div>

                            {/* AI Verification / Comparison Photos */}
                            <div className="col-span-3 flex items-center gap-3">
                                {student.session_photo ? (
                                    <div className="flex items-center gap-2">
                                        <div className="relative group">
                                            <img
                                                src={student.session_photo}
                                                alt="AI Session Crop"
                                                className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-400 shadow-sm"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
                                                <Camera className="w-2.5 h-2.5" />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Matched {confidencePercent}%
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                Biometric Verification
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium italic">
                                        No camera detection
                                    </span>
                                )}
                            </div>

                            {/* Status Badges */}
                            <div className="col-span-2 flex justify-center">
                                {isPresent ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Present
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        Absent
                                    </span>
                                )}
                            </div>

                            {/* Manual Actions */}
                            <div className="col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={() => onUpdate(student.id, "present")}
                                    className={`p-2 rounded-xl transition-all duration-200 ${
                                        isPresent
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    }`}
                                    title="Mark Present"
                                >
                                    <Check className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => onUpdate(student.id, "absent")}
                                    className={`p-2 rounded-xl transition-all duration-200 ${
                                        !isPresent
                                            ? "bg-rose-600 text-white shadow-sm"
                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    }`}
                                    title="Mark Absent"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}