import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async(userCredentials)=>{
        const request = await axios.post("http://localhost:3030/authentication",userCredentials)
        const response = await request.data
        localStorage.setItem("user",JSON.stringify(response))
        return response
    }
)

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async(userCredentials)=>{
        const request = await axios.post("http://localhost:3030/users",userCredentials)
        const response = await request.data
        return response
    }
)

//TODO: átalakítani get request-re
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

let initialState

if(getUser){
    initialState = {
        loading:false,
        error:null,
        user:getUser()
    }
}
else{
    initialState = {
        loading:false,
        error:null,
        user:null
    }
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        logoutUser: (state)=>{
            state.user = null
            state.error = null
            state.loading = false
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading = true
            state.user = null
            state.error = null
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false
            state.error=false
            state.user=action.payload
            
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false
            state.user = null
            state.error = action.error.message
            console.log(action.error.message)
        })
        .addCase(registerUser.pending,(state)=>{
            state.loading = true
            state.user = null
            state.error = null
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false
            state.error=false
            state.user=null
            
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false
            state.user = null
            state.error = action.error.message
            console.log(action.error.message)
        })
    }

})

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer