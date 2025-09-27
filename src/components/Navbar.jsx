import React from 'react'
import { Link } from 'react-router'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between p-4 h-full bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg mx-4 mt-4'>
            {/* Hamburger Menu */}
            <Sheet className="rounded-sm">
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-[150px] sm:w-[300px]">
                    <div className="flex flex-col space-y-4 mt-6">
                        <Link 
                            to="/dashboard" 
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/friends-secret" 
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Friends Secret
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default Navbar