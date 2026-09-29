import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-r bg-indigo-900 via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10">
        <div className="text-center">
            <h1 className="text-white text-7xl font-extrabold mb-8">Page NotFound</h1>
            <p className="text-cyan-500 text-5xl font-bold mb-4">404</p>
            <Link to="/">
                <button  className="text-pink-700 bg-white p-4 cursor-pointer rounded-full font-bold">Back to Home 
                    <ArrowRightIcon className="inline"/>
                </button>
            </Link>

        </div>
    </div>
  )
}
