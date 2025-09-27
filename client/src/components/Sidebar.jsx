import { Link } from "react-router"
import Dashboard from "../pages/Dashboard"
import FriendSecrets from "../pages/FriendSecrets"
import Home from "../pages/Home"


const SIDE_MENU_OPTIONS = [
    {
        label: "Dashboard",
        component: <Dashboard />,
        route: "/dashboard"
    },
    {
        label: "Friends Secret",
        component: <FriendSecrets />,
        route: "/friends-secret"
    },
]

const Sidebar = () => {
    return (
        <div className='flex flex-col gap-3 p-2 bg-gray-600 text-white h-full'>
            {SIDE_MENU_OPTIONS?.map((option, key) => {
                return (<Link to={option?.route} key={key} className='p-2 border-2 border-gray-800 rounded-md bg-gray-800 '>{option?.label}</Link>)
            })}
        </div>
    )
}

export default Sidebar
