import React from 'react'
import {useNavigate} from 'react-router-dom'

const Notfound = () => {
  const navigate = useNavigate()
  return (
    <>
    <div>User not found</div>
    <button onClick={()=>navigate(-1)}>GO back</button>
    </>
  )
}

export default Notfound