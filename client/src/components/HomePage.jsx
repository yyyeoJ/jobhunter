import React, { useState } from 'react'


function getUser(){
    let user = localStorage.getItem("user")
    if(user){
        user = JSON.parse(user)
    }
    else{
        user = null
    }
    return user
}


const HomePage = () => {


    const [user,setUser] = useState(getUser())
    console.log(user)

    const handleLogout = ()=>{
        localStorage.removeItem("user")
        setUser(null)
    }


    return (
    <div>HomePage</div>
    )
}

export default HomePage