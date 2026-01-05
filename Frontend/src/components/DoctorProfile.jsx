import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config.js";
import { useAuth } from "../Context/AuthContext";

const DoctorProfile = ({ onClose }) => {
  const { uid } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    designation: "",
    typeOfDoctor: "",
    specialistDetails: "",
    experience: "",
    email: "",
    gender: "",
    availableSlots: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Doctor Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/doctors/${uid}`);
        const data = await res.json();
        if (data?.message) {
          setFormData((prev) => ({
            ...prev,
            ...data.message,
            availableSlots: data.message.availableSlots || [],
          }));
        }
      } catch (error) {
        console.log("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, [uid]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/doctors/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      alert(data.message || "Profile updated successfully");

      setEditMode(false);
    } catch (error) {
      console.log("Error updating profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  const generateTimeSlots = () => {
    const slots = [];
    for (let minutes = 9 * 60; minutes <= 23 * 60; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:${min.toString().padStart(2, '0')} ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleSlot = (slot) => {
    if (!editMode) return;

    setFormData((prev) => {
      const updatedSlots = prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter((s) => s !== slot)
        : [...prev.availableSlots, slot];

      return { ...prev, availableSlots: updatedSlots };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] px-3">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative p-6">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-xl font-bold text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-3xl text-center text-gray-900 font-bold mt-4">
          {editMode ? "Edit Profile" : "Your Profile"}
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10"
        >

          {/* INPUT FIELDS */}
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Qualifications", name: "qualification", type: "text" },
            { label: "Designation", name: "designation", type: "text" },
            { label: "Type of Doctor", name: "typeOfDoctor", type: "text" },
            { label: "Specialist Details", name: "specialistDetails", type: "text" },
            { label: "Years of Experience", name: "experience", type: "number" },
            { label: "Email", name: "email", type: "email" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col">
              <label className="mb-1 font-medium">{item.label}</label>
              <input
                type={item.type}
                name={item.name}
                disabled={!editMode}
                value={formData[item.name] || ""}
                onChange={handleChange}
                className={`px-4 py-3 bg-[#ADD0DA] border border-black ${editMode ? "bg-white" : "cursor-not-allowed"
                  }`}
              />
            </div>
          ))}

          {/* GENDER SELECT */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Gender</label>

            <select
              name="gender"
              disabled={!editMode}
              value={formData.gender}
              onChange={handleChange}
              className={`px-4 py-3 bg-[#ADD0DA] border border-black ${editMode ? "bg-white" : "cursor-not-allowed"
                }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* AVAILABLE SLOTS */}
          <div className="col-span-1 sm:col-span-2">
            <label className="mb-2 font-medium block">
              Available Time Slots
            </label>

            <div
              className={`p-4 rounded-md ${editMode ? "bg-white" : "bg-[#ADD0DA]"
                } border border-black`}
            >
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = formData.availableSlots.includes(slot);

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      disabled={!editMode}
                      className={`
              px-2 py-2 rounded-md text-sm transition
              ${isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                        }
              ${!editMode ? "cursor-not-allowed opacity-70" : "hover:bg-blue-500"}
            `}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-gray-700 mt-3">
                {formData.availableSlots.length} slot
                {formData.availableSlots.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          {/* BUTTONS */}
          <div className="col-span-1 sm:col-span-2 flex justify-center gap-4 py-6 px-6 border-t border-gray-200">

            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="px-10 py-3 bg-blue-300 border border-black font-medium hover:bg-blue-400 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-10 py-3 bg-gray-300 border border-black font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-[#ADD0DA] border border-black font-medium hover:bg-[#9dc0ca] transition-colors"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
