import React, { useEffect,useState } from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import logo from "../assets/logo.png"
import {useDispatch, useSelector} from "react-redux"
import { logoutUser } from '../redux/UserSlice';   
import {useNavigate} from "react-router-dom" 

const Nav = () => {

    const navigate = useNavigate()

    const handleLogout = ()=>{
        localStorage.removeItem("user")
        dispatch(logoutUser())
        navigate("/")
    }

    const user = useSelector((state)=>state.user)

    const dispatch = useDispatch()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <Navbar shouldHideOnScroll isBordered isBlurred={false} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
        <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
        />
        <NavbarBrand>
            <Link href='/' color='foreground'>
                <img className='h-10' src={logo}/>
                <p className="font-bold text-inherit">JobHunter</p>
            </Link>
        </NavbarBrand>
        </NavbarContent>
        
    
        {user.user &&
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
            <Link color="foreground" href="/profile">
            My profile
            </Link>
        </NavbarItem>
        {user.user.user.role === "company" && 
        <NavbarItem>
            <Link href="/jobposting" aria-current="page">
            Add job posting
            </Link>
        </NavbarItem>
        }
        <NavbarItem className="sm:flex">
                <Button onClick={()=>handleLogout()} color="danger"  variant="flat">
                Logout
                </Button>
            </NavbarItem>
        </NavbarContent>
        }
        

        {!user.user &&
        <NavbarContent justify="end">
            <NavbarItem className="hidden sm:flex">
                <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem className="sm:flex">
                <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
                </Button>
            </NavbarItem>
        </NavbarContent>
        }
        
        
        
        <NavbarMenu>
            <NavbarMenuItem>
                <Link size='lg' href="/login">Login</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
                <Link size='lg' color='danger' href="/login">Logout</Link>
            </NavbarMenuItem>
        </NavbarMenu>
    </Navbar>
    )
}

export default Nav