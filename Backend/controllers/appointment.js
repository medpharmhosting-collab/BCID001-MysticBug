import { Appointment } from "../models/Appointment.js";
import { User } from "../models/user.js";
import { UserProfile } from "../models/userProfile.js";
import sendSMS from "../services/smsService.js";
import { createNotification } from "./notification.js";

export const createAppointment = async (req, res) => {
  try {

    const {
      patientName,
      patientId,
      reason,
      doctor,
      date,
      timeSlot,
      age,
      consultationType,
      doctorId
    } = req.body;

    if (!date || !timeSlot || !reason || !age) {
      return res.status(400).json({
        message: "date, timeSlot, reason and age are required"
      });
    }

    const appointmentDate = new Date(date);

    // Check if the slot is already booked for this doctor
    const existingAppointment = await Appointment.findOne({
      doctorId: doctorId,
      date: appointmentDate,
      timeSlot: timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: "This time slot is already booked for the selected doctor"
      });
    }

    // STEP A: Fetch patient profile
    const profile = await UserProfile.findOne({ uid: patientId });

    if (!profile) {
      return res.status(400).json({
        message: "Patient profile not found"
      });
    }

    if (!profile.mobile && !profile.phoneNumber) {
      return res.status(400).json({
        message: "Patient mobile number not found"
      });
    }

    const appt = new Appointment({
      patientName,
      age,
      reason,
      doctor,
      date: appointmentDate,
      timeSlot,
      patientId,
      consultationType,
      doctorId,
      status: "pending"
    });

    await appt.save();

    // Create notifications
    try {
      // Notification for patient
      await createNotification(
        patientId,
        'patient',
        'appointment_booked',
        'Your appointment has been booked. Wait for confirmation.'
      );

      // Notification for doctor
      await createNotification(
        doctorId,
        'doctor',
        'new_appointment',
        'Check out new appointments.'
      );

      console.log("Notifications created");
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr.message);
    }

    // STEP C: Send SMS (NON-BLOCKING & SAFE)
    try {
      const mobile = profile.phoneNumber;

      await sendSMS(
        process.env.SMS_TEMPLATE_APPOINTMENT_BOOKED,
        mobile,
        { name: patientName }
      );

      console.log("SMS triggered");
    } catch (smsErr) {
      console.error("SMS failed but appointment saved:", smsErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: appt
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create notification for patient
    try {
      await createNotification(
        appointment.patientId,
        'patient',
        'appointment_confirmed',
        'Your appointment has been confirmed.'
      );
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr.message);
    }

    // fetch patient profile
    const profile = await UserProfile.findOne({ uid: appointment.patientId });
    const mobile = profile.phoneNumber;

    await sendSMS(
      process.env.SMS_TEMPLATE_APPOINTMENT_APPROVED,
      mobile,
      { name: appointment.patientName }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create notification for patient
    try {
      await createNotification(
        appointment.patientId,
        'patient',
        'appointment_rejected',
        'Your appointment has been rejected.'
      );
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr.message);
    }

    // fetch patient profile
    const profile = await UserProfile.findOne({ uid: appointment.patientId });
    const mobile = profile.phoneNumber;

    await sendSMS(
      process.env.SMS_TEMPLATE_APPOINTMENT_REJECTED,
      mobile,
      { name: appointment.patientName }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
// auto appointment rejection functionality function
const autoRejectExpiredAppointments = async () => {
  const now = new Date();

  const appointments = await Appointment.find({ status: "pending" });

  for (const appt of appointments) {
    const appointmentDate = new Date(appt.date);

    // Convert timeSlot to valid hours and minutes
    const [timeStr, period] = appt.timeSlot.split(" ");
    const [hourStr, minStr] = timeStr.split(":");
    let hours = parseInt(hourStr);
    let minutes = parseInt(minStr || 0);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const expiryDateTime = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate(),
      hours,
      minutes,
      0
    );

    if (expiryDateTime < now) {
      appt.status = "rejected";
      await appt.save();
    }
  }
};
export const fetchAllAppointments = async (req, res) => {
  try {
    const { uid } = req.params;
    const { doctor } = req.query;
    await autoRejectExpiredAppointments();

    let appointments;
    if (doctor) {
      appointments = await Appointment.find({ doctor: doctor });
    } else {
      appointments = await Appointment.find({ patientId: uid });
    }
    return res.status(200).json({ data: appointments });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyTraffic = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatted = months.map((m, i) => {
      const found = data.find(d => d._id === i + 1);
      return { month: m, value: found ? found.count : 0 };
    });

    res.status(200).json({ data: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const fetchAllAppointmentsForAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: -1 });

    return res.status(200).json({ success: true, data: appointments });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });

  }
}

export const todayAppointmentCount = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const count = await Appointment.countDocuments({
      date: { $gte: todayStart, $lt: todayEnd },
    });
    res.json({ todaysAppointment: count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
export const appointmentWithQueryParams = async (req, res) => {
  try {
    const { doctor, patientName } = req.query;

    let query = {};
    if (doctor) query.doctor = doctor;
    if (patientName) query.patientName = patientName;

    const appointments = await Appointment.find(query).sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
}

export const getPatientAppointment = async (req, res) => {
  try {
    await autoRejectExpiredAppointments()
    const { uid } = req.params
    const user = await Appointment.find({ patientId: uid })

    return res.status(200).json({ appointment: user || [] })
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });

  }
}
export const getPatientsOfDoctor = async (req, res) => {
  try {
    const { uid } = req.params;
    await autoRejectExpiredAppointments();

    const uniquePatients = await Appointment.aggregate([
      { $match: { doctorId: uid } },
      {
        $group: {
          _id: { patientId: "$patientId" },
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } }
    ]);

    res.status(200).json({ patients: uniquePatients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }

    const appointmentDate = new Date(date);

    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      date: appointmentDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    res.status(200).json({ bookedSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmedPatientsYesterday = async (req, res) => {
  try {
    const now = new Date();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Patients with confirmed appointments yesterday
    const yesterdaysConfirmedAppointments = await Appointment.find({
      date: { $gte: yesterdayStart, $lt: yesterdayEnd },
      status: "confirmed"
    }).distinct('patientId');

    // Patients with confirmed appointments before yesterday
    const previousConfirmedAppointments = await Appointment.find({
      date: { $lt: yesterdayStart },
      status: "confirmed"
    }).distinct('patientId');

    const previousSet = new Set(previousConfirmedAppointments);

    const newPatients = yesterdaysConfirmedAppointments.filter(pid => !previousSet.has(pid));
    const existingPatients = yesterdaysConfirmedAppointments.filter(pid => previousSet.has(pid));

    res.status(200).json({ new: newPatients.length, existing: existingPatients.length });
  } catch (error) {
    console.error("Error fetching confirmed patients yesterday:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const confirmedPatientsToday = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Patients with confirmed appointments today
    const todaysConfirmedAppointments = await Appointment.find({
      date: { $gte: todayStart, $lt: todayEnd },
      status: "confirmed"
    }).distinct('patientId');

    // Patients with confirmed appointments before today
    const previousConfirmedAppointments = await Appointment.find({
      date: { $lt: todayStart },
      status: "confirmed"
    }).distinct('patientId');

    const previousSet = new Set(previousConfirmedAppointments);

    const newPatients = todaysConfirmedAppointments.filter(pid => !previousSet.has(pid));
    const existingPatients = todaysConfirmedAppointments.filter(pid => previousSet.has(pid));

    res.status(200).json({ new: newPatients.length, existing: existingPatients.length });
  } catch (error) {
    console.error("Error fetching confirmed patients today:", error);
    res.status(500).json({ message: "Server error" });
  }
};
