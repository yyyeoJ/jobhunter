import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async(userCredentials)=>{
        console.log(userCredentials)
        const request = await axios.post("http://localhost:3030/authentication",userCredentials)
        const response = await request.data
        localStorage.setItem("user",JSON.stringify(response))
        return response
    }
)


const userSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        user: null,
        error: null
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
    }

})

export default userSlice.reducer