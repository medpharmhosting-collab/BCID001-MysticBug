import { useState, useEffect } from "react";
import { icons } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { BASE_URL } from "../../config/config.js"

const Investors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [investorsData, setInvestorsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    income: "",
    expense: "",
    profits: "",
    roi: "",
    equityValuation: "",
    profitability: "",
  });

  const navigate = useNavigate();

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/investors/get_investors`);
      const data = await res.json();
      if (res.ok) setInvestorsData(data.investors || []);
    } catch (err) {
      console.error("Error fetching investors:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvestors();
  }, []);

  const filteredData = investorsData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("filtered data:", filteredData)

  const handleInvestorClick = (id) => {
    const investor = investorsData.find((i) => i._id === id);
    if (investor) {
      setSelectedInvestor(investor);
      setFormData({
        name: investor.name || "",
        income: investor.income || "",
        expense: investor.expense || "",
        profits: investor.profits || "",
        roi: investor.roi || "",
        equityValuation: investor.equityValuation || "",
        profitability: investor.profitability || "",
      });
      setModalOpen(true);
    }
  };
  const handleInvestorDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this investor?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/investors/delete_investor/${id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }
      // ✅ refetch list
      await fetchInvestors();
    }
    catch (err) {
      console.error("Error fetching investors:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/investors/update_investor/${selectedInvestor._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");

      setInvestorsData((prev) =>
        prev.map((item) =>
          item._id === selectedInvestor._id ? { ...item, ...formData } : item
        )
      );

      setModalOpen(false);
      setSelectedInvestor(null);
      alert("Investor updated successfully!");
    } catch (err) {
      console.error("Error updating investor:", err);
      alert("Error updating investor data.");
    }
  };

  return (
    <div className="bg-[#d1e8f3] min-h-screen p-8">
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Investor</h1>
        <button
          className='px-3 py-1 bg-gray-200 rounded-lg cursor-pointer'
          onClick={() => navigate('add_investor')}>
          Add Investor
        </button>
      </div>

      <div className="flex items-center gap-2 w-full p-2 rounded-md mt-8 bg-gray-200">
        <icons.FaSearch size={20} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          className="w-full bg-transparent outline-none placeholder:text-[#4A739C]"
          placeholder="Search investor"
        />
      </div>

      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">Investor ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Income</th>
              <th className="px-4 py-3">Expense</th>
              <th className="px-4 py-3">Profits</th>
              <th className="px-4 py-3">Return On Investment</th>
              <th className="px-4 py-3">Equity Valuation</th>
              <th className="px-4 py-3">Profitability</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Manage</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="py-6">
                  <Loader />
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr className="text-center hover:bg-gray-50" key={data._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{data.name}</td>
                  <td className="px-4 py-3 font-medium">{data.email}</td>
                  <td className="px-4 py-3">{data.income || "-"}</td>
                  <td className="px-4 py-3">{data.expense || "-"}</td>
                  <td className="px-4 py-3">{data.profits || "-"}</td>
                  <td className="px-4 py-3">{data.roi || "-"}</td>
                  <td className="px-4 py-3">{data.equityValuation || "-"}</td>
                  <td className="px-4 py-3">{data.profitability || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center h-full">
                      <icons.BiEdit
                        size={22}
                        className="cursor-pointer text-gray-600 hover:text-blue-500 transition-transform duration-150 hover:scale-110"
                        onClick={() => handleInvestorClick(data._id)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center h-full">
                      <icons.MdDelete
                        size={22}
                        className=" cursor-pointer text-red-500 hover:text-red-600 transition-transform duration-150 hover:scale-110"
                        onClick={() => handleInvestorDelete(data._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center font-semibold text-red-500">
                <td colSpan="11" className="py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#00000066] backdrop-blur-sm flex justify-center items-center z-[150]">
          <div className="bg-blue-200/50 border-2 border-amber-500 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-[420px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-5 text-[#1E3A8A] text-center">
              Edit Investor
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income
                </label>
                <input
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Income"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense
                </label>
                <input
                  name="expense"
                  value={formData.expense}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Expense"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profits
                </label>
                <input
                  name="profits"
                  value={formData.profits}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Profits"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return on Investment (ROI)
                </label>
                <input
                  name="roi"
                  value={formData.roi}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter ROI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equity Valuation
                </label>
                <input
                  name="equityValuation"
                  value={formData.equityValuation}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Equity Valuation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profitability
                </label>
                <input
                  name="profitability"
                  value={formData.profitability}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-white/80 placeholder-gray-400"
                  placeholder="Enter Profitability"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investors;
