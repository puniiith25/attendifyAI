import { Users } from "lucide-react"

const StatCard = ({ title, value, change, subtitle, icon: Icon }) => {

    return (

        <div className="bg-white border rounded-lg p-5 flex justify-between items-start">

            <div>

                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <h2 className="text-2xl font-semibold mt-1">
                    {value}
                </h2>

                <p className="text-xs text-green-600 mt-1">
                    {change}
                </p>

                <p className="text-xs text-gray-400">
                    {subtitle}
                </p>

            </div>

            <Icon className="text-gray-400 w-6 h-6" />

        </div>

    )

}

export default StatCard