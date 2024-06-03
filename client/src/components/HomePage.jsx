import React, { useState } from 'react'


function getUser(){
    let user = localStorage.getItem("user")
    if(user != "undefined"){
        user = JSON.parse(user)
    }
    else{
        user = null
    }
    return user
}


const HomePage = () => {


    return (
    <>
        <div>Homepage</div>
        
        
        
    </>
    
    )
}

export default HomePage