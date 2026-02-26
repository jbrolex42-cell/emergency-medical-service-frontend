import React, { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import toast from "react-hot-toast"
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

/* ===============================
 ENTERPRISE CONFIGURATION
================================*/

const PHONE_REGEX = /^(?:\+254|0)?7\d{8}$/

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/

export default function Register(){

  const navigate = useNavigate()
  const registerApi = useAuthStore(state=>state.register)

  const [form,setForm] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    role:"patient"
  })

  const [loading,setLoading] = useState(false)
  const requestLock = useRef(false)
  const [showPassword,setShowPassword] = useState(false)

  /* ===============================
   ENTERPRISE VALIDATION ENGINE
  =================================*/

  const validate = () => {

    if(!form.name || !form.email || !form.phone){
      toast.error("Required fields missing")
      return false
    }

    if(!PHONE_REGEX.test(form.phone)){
      toast.error("Invalid Kenyan phone format")
      return false
    }

    if(!PASSWORD_REGEX.test(form.password)){
      toast.error("Password must be 6+ characters with numbers")
      return false
    }

    if(form.password !== form.confirmPassword){
      toast.error("Passwords do not match")
      return false
    }

    return true
  }

  /* ===============================
   ENTERPRISE SUBMISSION LOCK
  =================================*/

  const handleSubmit = async(e)=>{
    e.preventDefault()

    if(loading || requestLock.current) return
    if(!validate()) return

    requestLock.current = true
    setLoading(true)

    try{

      const { confirmPassword,...payload } = form

      const result = await registerApi(payload)

      if(result?.success){
        toast.success("Account created")
        navigate("/subscription")
      }else{
        toast.error(result?.error || "Registration failed")
      }

    }catch(error){
      console.error("Signup Error:",error)
      toast.error("Server connection error")
    }

    requestLock.current = false
    setLoading(false)
  }

  /* ===============================
   SAFE STATE UPDATE
  =================================*/

  const updateField = (field,value)=>{
    setForm(prev=>({
      ...prev,
      [field]:value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Enterprise Account Setup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            icon={<User/>}
            label="Full Name"
            value={form.name}
            onChange={v=>updateField("name",v)}
          />

          <InputField
            icon={<Mail/>}
            label="Email"
            type="email"
            value={form.email}
            onChange={v=>updateField("email",v)}
          />

          <InputField
            icon={<Phone/>}
            label="Phone (+254 format)"
            value={form.phone}
            onChange={v=>updateField("phone",v)}
          />

          <PasswordField
            label="Password"
            value={form.password}
            show={showPassword}
            toggle={()=>setShowPassword(!showPassword)}
            onChange={v=>updateField("password",v)}
          />

          <InputField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={v=>updateField("confirmPassword",v)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition"
          >
            {loading ? <Spinner/> : <>
              Create Enterprise Account
              <CheckCircle size={18}/>
            </>}
          </button>

        </form>

        <p className="text-center text-sm mt-6">
          Already have account?
          <Link to="/login" className="text-blue-600 ml-1 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

/* ===============================
 REUSABLE COMPONENTS
================================*/

function InputField({icon,label,value,onChange,type="text"}){

  return (
    <div>
      <label className="text-sm font-medium block mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={e=>onChange(e.target.value)}
          className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  )
}

function PasswordField({label,value,onChange,show,toggle}){

  return (
    <div>
      <label className="text-sm font-medium block mb-2">
        {label}
      </label>

      <div className="relative">

        <input
          type={show ? "text":"password"}
          value={value}
          onChange={e=>onChange(e.target.value)}
          className="w-full border rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff/> : <Eye/>}
        </button>

      </div>
    </div>
  )
}

function Spinner(){
  return (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
  )
}