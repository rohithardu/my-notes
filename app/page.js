"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
  import { ToastContainer, toast } from 'react-toastify';
  import { Bounce } from "react-toastify";

export default function Home() {
  const [form, setform] = useState({ title: "", note: "", tags: "" })
  const [noteArray, setnoteArray] = useState([])
  const [search, setsearch] = useState("")
  const [allNotes, setAllNotes] = useState([])
  const [matches, setmatches] = useState(false)
  const [count, setcount] = useState(0)
  const colors = ["red", "sky", "green", "amber", "violet", "purple", "pink", "cyan"]
  const colorClassMap = {
    red: "bg-red-400",
    sky: "bg-sky-400",
    green: "bg-green-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
    purple: "bg-purple-400",
    pink: "bg-pink-400",
    cyan: "bg-cyan-400"
  }

  useEffect(() => {
    const notes = localStorage.getItem("notes")
    if (notes) {
      setnoteArray(JSON.parse(notes))
      setAllNotes(JSON.parse(notes))
    }
  }, [])


  const handleChange = (e) => {
    if ((e.target.name) === "title") {
      setform({ ...form, title: e.target.value.toUpperCase() })
    } else {
      setform({ ...form, [e.target.name]: e.target.value })
    }
  }
  const handleChange2 = (e) => {
    const value = e.target.value
    setform({ ...form, note: value })
    setcount(value.length)
  }

  const saveForm = () => {
    if (form.title === "" || form.note === "") {
      toast.warn(`Please add title and note`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
      return
    }
    handleSave()
  }


  const handleSave = () => {
    const number = Math.floor(Math.random() * 8)
    const randomColor = colors[number]
    console.log(randomColor)
    const newNote = { ...form, id: uuidv4(), color: randomColor }
    localStorage.setItem("notes", JSON.stringify([...noteArray, newNote]))
    setnoteArray([...noteArray, newNote])
    setAllNotes([...allNotes, newNote])
    setform({ title: "", note: "", tags: "" })
    setcount(0)
    toast('Added', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light"
});
  }

  const deleteNote = (id) => {
    let c = confirm("Do you want to delete this note?")
    if (c) {
      localStorage.setItem("notes", JSON.stringify(noteArray.filter((item) => item.id !== id)))
      setnoteArray(noteArray.filter((item) => item.id !== id))
      setAllNotes(allNotes.filter((item) => item.id !== id))
      toast('Note Deleted.', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light"
});

    }
  }

  const editNote = (id) => {
    setform(noteArray.filter((item) => item.id === id)[0])
    setnoteArray(noteArray.filter((item) => item.id !== id))
    setAllNotes(allNotes.filter((item) => item.id !== id))
  }

  const handleChange3 = (e) => {
    const value = e.target.value
    setsearch(value)

    if (value === "") {
      setnoteArray(allNotes)
      setmatches(false)
    } else {
      const filtered = allNotes.filter((item) => {
        return item.title.toLowerCase().includes(value.toLowerCase()) || item.note.toLowerCase().includes(value.toLowerCase()) || (item.tags && item.tags.toLowerCase().includes(value.toLowerCase()))
      })
      setnoteArray(filtered)
      if (filtered.length === 0) {
        setmatches(true)
      }
    }
  }


  return (<>
  <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
    <div className="bg-slate-100 min-h-screen">
      <div className="py-8 flex flex-col items-center gap-3 relative">
        <h1 className="text-4xl font-bold">N<span className="text-red-500">o</span>teb<span className="text-blue-500">o</span><span className="text-green-500">o</span>k</h1>
        <div className="flex flex-col gap-3 w-full items-center">
          <input autoFocus type="text" value={form.title} className="w-[30%] uppercase rounded-full px-3 py-1 bg-white outline outline-blue-200" placeholder="Add Title" name="title" id="title" onChange={handleChange} />
          <div className="w-[40%] relative">
            <div className="absolute right-1 opacity-50">{count}/300</div>
            <textarea maxLength={300} name="note" value={form.note} id="note" className="bg-white w-full p-2 rounded-md leading-5 outline outline-blue-200" placeholder="Enter your note" onChange={handleChange2}></textarea>
          </div>
          <input type="text" className="w-[10%] rounded-full px-3 py-1 bg-white outline outline-blue-200" placeholder="Add tags" onChange={handleChange} value={form.tags} name="tags" id="tags" />
        </div>
        <div className="absolute right-10 top-20">
          <img className="absolute left-2 top-2" src="search.svg" alt="search" width={15} height={15} />
          <input type="text" className="bg-white rounded-full px-8 py-1 outline outline-blue-200" placeholder="Search" onChange={handleChange3} name="search" value={search} />
        </div>
        <button onClick={saveForm} className="px-4 py-2 bg-cyan-300 rounded-full font-bold cursor-pointer">Add Note</button>
      </div>
      <div className="showNotes notes-masonry max-w-[80vw] mx-auto flex-wrap">
        {noteArray.map((item, index) => {
          const color = item.color || "green";
          const bgClass = colorClassMap[color] || colorClassMap["green"];
          return <div key={index} className={`note-card max-w-[20vw] h-fit p-3 pb-7 rounded-lg ${bgClass} flex flex-col p-2 relative`}>
            <div className="font-semibold text-xl break-all">{item.title}</div>
            <div className="whitespace-pre-wrap break-words text-md overflow-hidden">{item.note}</div>
            {item.tags && (<div className={`text-xs bg-gray-200 rounded-full py-1 px-2 w-fit`}>{item.tags}</div>)}
            <div className="images flex gap-2 absolute bottom-2">
              <img onClick={() => { editNote(item.id) }} className="cursor-pointer" src="edit.svg" alt="edit" width={14} height={14} />
              <img onClick={() => { deleteNote(item.id) }} className="cursor-pointer" src="delete.svg" alt="delete" width={14} height={14} />
            </div>
          </div>
        })}
        {noteArray.length === 0 && <div>{search ? "No matches found" : "No notes to show"}</div>}
      </div>
    </div>
  </>
  );
}
