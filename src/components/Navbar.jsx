import React from 'react'
import { Link } from 'react-router'
import { Menu, Wallet } from 'lucide-react'
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
        <nav className='fixed top-4 left-4 right-4 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-transparent shadow-2xl'>
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

            {/* Connect Wallet Button */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
            </Button>
        </nav>
    )
}

export default Navbar