import React from 'react'
import {useSelector} from "react-redux"

const Profile = () => {

    const user = useSelector((state)=>state.user)

return (

    <>
        <div>Profile</div>
        {user.user && 
        <>
        <div>Full name: {user.user.user.fullname}</div>
        <div>Email: {user.user.user.email}</div>
        <div>Role: {user.user.user.role}</div>
        </>
        }
    </>

    
)
}

export default Profile