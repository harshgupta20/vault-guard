import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between p-3 h-full bg-gray-800 text-white'>
            <h1>Navbar</h1>


            <ul className='flex gap-2 items-center'>
                <li>Connect</li>
            </ul>
        </nav>
    )
}


export default Navbar