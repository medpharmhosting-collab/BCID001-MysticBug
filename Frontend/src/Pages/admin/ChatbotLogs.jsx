import { useEffect, useState } from 'react'
import { icons } from '../../assets/assets'
import Loader from './Loader'
import { BASE_URL } from "../../config/config.js"

const ChatbotLogs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [editData, setEditData] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })



  // Fetch FAQs ---------------------
  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/faqs`)
      const data = await res.json()

      setFaqs(Array.isArray(data.message) ? data.message : [])
      setLoading(false)
    } catch (error) {
      console.log("error while getting faqs", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  // Delete FAQ 
  const deleteFAQ = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${BASE_URL}/faqs/${id}`, { method: "DELETE" })
      fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  // Update FAQ 
  const updateFAQ = async () => {
    try {
      await fetch(`${BASE_URL}/faqs/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      })
      setEditData(null)
      fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  // Add FAQ  
  const addFAQ = async () => {
    if (!newFaq.question || !newFaq.answer) {
      alert("Both fields required!")
      return
    }

    try {
      const result = await fetch(`${BASE_URL}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaq)
      })
      const json = await result.json()
      setNewFaq({ question: "", answer: "" })
      setAddModal(false)
      setTimeout(() => {
        fetchFaqs()
      }, 2000);
    } catch (err) {
      console.error(err)
    }
  }

  // Search filter 
  const filteredData = faqs.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>

      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Chatbot Interactions</h1>
        </div>

        {/* ADD FAQ BUTTON */}
        <button
          onClick={() => {
            if (faqs.length >= 10) {
              alert("Cannot add more than 10 FAQs");
              return;
            }
            setAddModal(true);
          }}
          className={`px-4 py-2 rounded shadow text-white ${faqs.length >= 10
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600"
            }`}
        >
          Add FAQ
        </button>
      </div>

      {/* Search Box */}
      <div className='flex justify-center items-center gap-2 w-full p-2 rounded-md mt-6 bg-gray-200'>
        <span><icons.FaSearch /></span>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          className='w-full bg-transparent outline-none placeholder:text-[#4A739C]'
          placeholder='Search question'
        />
      </div>

      {/* Table */}
      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Answer</th>
              <th className="px-4 py-3">Edit</th>
              <th className="px-4 py-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className='py-6'><Loader /></td></tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr className="text-center" key={item._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 max-w-[250px] whitespace-normal break-words">
                    {item.question}
                  </td>

                  <td className="px-4 py-3 max-w-[300px] whitespace-normal break-words">
                    {item.answer}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditData(item)}
                      className="px-3 py-1 bg-blue-200 rounded">
                      Edit
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteFAQ(item._id)}
                      className="px-3 py-1 bg-red-200 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='text-center font-semibold text-red-500'>
                <td colSpan="6" className="py-4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*   EDIT MODAL  */}
      {editData && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit FAQ</h2>

            <label className='text-sm font-semibold'>Question</label>
            <textarea
              value={editData.question}
              onChange={(e) => setEditData({ ...editData, question: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />

            <label className='text-sm font-semibold mt-3 block'>Answer</label>
            <textarea
              value={editData.answer}
              onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
              className="w-full p-2 border rounded mt-1"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button className='px-4 py-1 bg-gray-300 rounded' onClick={() => setEditData(null)}>Cancel</button>
              <button className='px-4 py-1 bg-blue-500 text-white rounded' onClick={updateFAQ}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/*  ADD MODAL  */}
      {addModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[550px]">
            <h2 className="text-xl font-bold mb-4">Add New FAQ</h2>

            <label className='text-sm font-semibold'>Question</label>
            <textarea
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full p-2 border-2 border-gray-400 rounded mt-1 outline-none"
            />

            <label className='text-sm font-semibold mt-3 block'>Answer</label>
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full p-2 border-2 border-gray-400 rounded mt-1 outline-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button className='px-4 py-1 bg-gray-300 rounded' onClick={() => setAddModal(false)}>Cancel</button>
              <button className='px-4 py-1 bg-green-600 text-white rounded' onClick={addFAQ}>Add FAQ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ChatbotLogs
