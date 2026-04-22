import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Todo() {
    let [formhide, setFormhide]=useState(false)
    let [hideUpdate, setHideUpdate]=useState(false)

    let [post, setPost]=useState([])  
    
    let [formUpdate, setFormUpdate]=useState({
        title:'',
        description:''
    })

    let [editid,setEditid]=useState(null)
    let [read,setRead]=useState({})
    
    function updateData(elem){
        setFormUpdate({
            title:elem.title,
            description:elem.description
        })
        setEditid(elem._id)
    }

    const handleGetData = async ()=>{
        await axios.get('http://localhost:3000/todo-read')
        .then((res)=>{
            setPost(res.data.post)
        })
        .catch((err)=>{
            console.log(err);       
        })
    }
    useEffect(()=>{
        handleGetData()
    },[])

   async function handleForm(e){
        e.preventDefault()
        let formData=new FormData(e.target)
        let title=formData.get("title")
        let  description=formData.get('description')
        try{
           let res= await axios.post('http://localhost:3000/todo-create', 
           { title,description}
           )
            setPost(prev => [...prev, res.data.post])
            setFormhide(false)
        }
        catch(e){
            console.log(e);   
        }
    }    

    const handleDelete= async (id)=>{
        try{
        await axios.delete(`http://localhost:3000/todo-delete/${id}`)
        setPost(prev => prev.filter(elem => elem._id !==id))

        }
        catch(e){
            console.log(e);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault()
        try{
          let res=  await axios.patch(`http://localhost:3000/todo-update/${editid}`,formUpdate)
          setPost(prev =>
            prev.map(e =>
                e._id==editid?
                {...prev,...formUpdate}:e
            )
          )
          console.log(res);
          setHideUpdate(false)
        }

        catch(e){
            console.log(e);
        }
    }

    function handleRead(elem){
        setRead(prev => ({
            ...prev,
           [elem._id]:!prev[elem._id]
        }))
    }
  

  return (
    <div className='w-full h-screen relative'>
      
        {
            formhide &&(
                <>
                  <div onClick={()=>{setFormhide(false)}} className='inset-0 absolute z-10 w-full h-full cursor-pointer bg-black/30 backdrop-blur-[3px]'></div>
                  <div>
        <form onSubmit={handleForm} className='border w-60 z-10 h-60 flex flex-col items-center pt-3 gap-2 px-3 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <div className='font-semibold text-3xl '>
            Add Task
        </div>
        <input type="text" placeholder='Enter Your title' name='title' className='border outline-0 px-2 py-1.5 rounded-full mt-5 text-sm w-full ' />
        <input type="text" placeholder='Enter Your description' name='description' className='border outline-0 px-2 py-1.5 mb-3 rounded-full text-sm w-full ' />
        <button type='submit' className='font-semibold w-full cursor-pointer bg-green-500 rounded-full py-1.5 '>Add Task</button>
        </form>
        </div>
                </>
            )
        }
        {
            hideUpdate && (
            <>
        <div onClick={()=>{setHideUpdate(false)}}  className='inset-0 absolute z-10 w-full h-full cursor-pointer bg-black/30 backdrop-blur-[3px]'></div>
        <div>
        <form onSubmit={handleUpdate}  className='border w-60 z-10 h-60 flex flex-col items-center pt-3 gap-2 px-3 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <div className='font-semibold text-3xl '>
            Update Task
        </div>
        <input type="text" placeholder='Enter Your title' value={formUpdate.title} name='title' onChange={(elem)=>{setFormUpdate({...formUpdate,title:elem.target.value})}}  className='border outline-0 px-2 py-1.5 rounded-full mt-5 text-sm w-full ' />
        <input type="text" placeholder='Enter Your description' value={formUpdate.description} onChange={(elem)=>{setFormUpdate({...formUpdate, description:elem.target.value})}} name='description' className='border outline-0 px-2 py-1.5 mb-3 rounded-full text-sm w-full ' />
        <button type='submit' className='font-semibold w-full cursor-pointer bg-green-500 rounded-full py-1.5 '>Update Task</button>
        </form>
        </div>
            </>
            )
        }
        <div className='flex items-center justify-center h-full' >
            <div className='border w-120 h-100 overflow-y-auto p-5 rounded-2xl relative' >
               
                <div className='fixed'>
                <button onClick={()=>{setFormhide(true)}} className='w-110 bg-green-500   py-2 rounded-full font-semibold cursor-pointer text-white'>Add Task</button>
                </div>
            <div className=' pt-15 flex flex-col gap-4 w-full h-full'>
                {
                    post.length >0 ?(
                        post.map((elem)=>{
                            return <div key={elem._id} className='flex items-center justify-between gap-10'>
                    <div className='flex gap-3 items-center justify-center'>
                        <div onClick={()=>{handleRead(elem)}} className={`border ${read[elem._id]?'bg-red-500':'bg-white'} rounded-full px-1 py-1`}>
                        </div>
                        <div>
                    <h1 className={`${read[elem._id]?'line-through opacity-40':''}`}><span className='font-semibold'>Title:</span> {elem.title} </h1>
                    <h1 className={`${read[elem._id]?'line-through opacity-40':''}`}><span className='font-semibold'>Description:</span> {elem.description}</h1>
                        </div>
                    </div>
                <div className='flex gap-2 items-center justify-center'>
                    <button onClick={()=>{handleDelete(elem._id)}} className='bg-red-500 rounded-full px-2 py-0.5 text-sm text-white cursor-pointer '>Delete</button>
                    <button disabled={read[elem._id]} onClick={()=>{setHideUpdate(true)
                      updateData(elem)

                    }} className={`bg-blue-500 rounded-full ${read[elem._id]?'opacity-40':''} px-2 py-0.5 text-sm text-white cursor-pointer `}>update</button>
                </div>
                </div>
                        })
                    ):(
                        <div className='w-full h-full flex items-center justify-center animate-pulse'>No data is found...</div>
                    )
                }
            </div>
            </div>
        </div>
    </div>
  )
}

export default Todo