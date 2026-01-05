import { User } from "../models/user.js"
import { Appointment } from "../models/Appointment.js"
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params
    const doctor = await User.findById({ _id: id }).select('uid name qualification designation typeOfDoctor email specialization isActive experience gender')
    res.status(200).json({ doctorId: doctor.uid, doctorProfile: doctor })
  } catch (error) {
    console.log("error while fetching doctor uid")
    res.status(500).json({ error: "error while fetching doctor uid" })
  }
}

export const fetchDoctors = async (req, res) => {
  try {
    const doctorsData = await User.find({ userType: 'doctor' }).select('uid name email specialization isActive typeofdoctor qualification experience availableSlots gender').lean();

    res.status(200).json({ doctors: doctorsData })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
export const fetchActiveDoctorData = async (req, res) => {
  try {
    const doctorsData = await User.find({ userType: 'doctor', isActive: true }).select('uid name email specialization isActive typeofdoctor qualification experience availableSlots gender').lean();

    res.status(200).json({ doctors: doctorsData })
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getCountOfActiveDoctors = async (req, res) => {
  try {
    const doctorsData = await User.countDocuments({ userType: 'doctor', isActive: true })
    res.status(200).json({ activeDoctorsCount: doctorsData })
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to fetch active doctors" });
  }
}

export const getPatientsofDoctor = async (req, res) => {
  try {
    const { uid } = req.params;
    const doctor = await User.findOne({ uid, userType: "doctor" });
    if (!doctor) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }
    const uniquePatients = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor.name,
          status: "confirmed"
        }
      },
      {
        $group: {
          _id: "$patientId",
          patientName: { $first: "$patientName" },
          age: { $first: "$age" },
          date: { $first: "$date" },
          uid: { $first: "$patientId" },
          doctor: { $first: "$doctor" },
          status: { $first: "$status" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "uid",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          patientName: 1,
          age: 1,
          date: 1,
          uid: 1,
          doctor: 1,
          status: 1,
          gender: "$user.gender"
        }
      }
    ]);
    res.status(200).json({ patients: uniquePatients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: error.message });
  }
}

export const getDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await User.findOne({ uid: doctorId })
    if (!doctor) {
      return res.status(404).json({ message: "doctor not found" })
    }
    res.status(200).json({ success: true, message: doctor })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateDoctorByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: req.body },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: "doctor updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findOneAndDelete({ _id: id, userType: "doctor" })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "doctor not found" });
    }
    res.status(200).json({ success: true, message: "doctor deleted successfully" })
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
