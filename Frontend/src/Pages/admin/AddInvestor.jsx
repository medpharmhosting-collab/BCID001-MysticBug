import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from "../../config/config.js"
import { icons } from "../../assets/assets.js"
const AddInvestor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    investorName: '',
    income: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eye, setEye] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.investorName || !formData.email || !formData.password) {
      setError('Doctor name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/add-investor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.investorName,
          email: formData.email,
          password: formData.password,
          income: formData.income,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add investor');
      }

      setSuccess('investor added successfully! They can now login.');

      // Reset form
      setFormData({
        investorName: '',
        email: '',
        password: '',
        income: '',
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/admin-dashboard/investors');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to add investor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#d1e8f3] min-h-screen overflow-auto p-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Add New Investor</h1>
        <button
          onClick={() => navigate('/admin-dashboard/investors')}
          className='px-3 py-1 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition'
        >
          Go Back
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <div className="flex flex-col">
          <label htmlFor="investorName" className="mb-1 font-medium">
            Investor Name *
          </label>
          <input
            type="text"
            id="investorName"
            value={formData.investorName}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="Enter investor full name"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="income" className="mb-1 font-medium">
            Income
          </label>
          <input
            type="number"
            id="income"
            inputMode='number'
            value={formData.income}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="100000"
            disabled={loading}
            min={0}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="example@gmail.com"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium">
            Password *
          </label>
          <div className='bg-white flex justify-between items-center px-2'>
            <input
              type={eye ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
            <span className='cursor-pointer' onClick={() => setEye(!eye)}>{eye ? <icons.FaRegEye /> : <icons.FaRegEyeSlash />}</span>
          </div>
        </div>

        <div className="col-span-full flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Investor...' : 'Add Investor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddInvestor