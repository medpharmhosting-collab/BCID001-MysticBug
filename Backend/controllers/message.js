import { Appointment } from "../models/Appointment.js";
import { Message } from "../models/Message.js"
import { User } from "../models/user.js";
export const incomingMessagetoDoctorViaPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // Fetch all patients assigned to doctor (appointments) 
    const assignedPatients = await Appointment.find({ doctorId: doctorId })
    // Convert appointment patients to simple list
    let patientList = assignedPatients.map(p => ({
      patientId: p.patientId,
      patientName: p.patientName
    }));

    // Fetch patients who have chatted
    const chatPatients = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: doctorId, receiverRole: "patient" },
            { receiverId: doctorId, senderRole: "patient" }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', doctorId] },
              '$receiverId',
              '$senderId'
            ]
          },
          patientName: {
            $first: {
              $cond: [
                { $eq: ['$senderId', doctorId] },
                '$receiverName',
                '$senderName'
              ]
            }
          }
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
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: 1,
          patientName: 1
        }
      }
    ]);

    const chatList = chatPatients.map(item => ({
      patientId: item._id,
      patientName: item.patientName
    }));

    //  Merge assigned patients + chat patients
    const merged = [...patientList, ...chatList];

    // Remove duplicates
    const uniquePatients = Array.from(
      new Map(merged.map(item => [item.patientId, item])).values()
    );

    res.status(200).json(uniquePatients);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

export const conversationBetweenUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages: messages || [] });
  } catch (error) {
    return res.status(500).json({ error: 'Server error fetching messages' });
  }
}
export const deleteConversationBetweenUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    await Message.deleteMany({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    });

    res.status(200).json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName,
      receiverRole,
      message
    } = req.body;
    // Validation
    if (!senderId || !receiverId || !message || !senderRole || !receiverRole) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const newMessage = new Message({
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName,
      receiverRole,
      message,
      timestamp: new Date()
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: 'Server error sending message' });
  }
}
export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: receiverId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
}
export const getLastMessageBetweenUsers = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    console.log("userId and otherUserId:", userId, otherUserId)
    const lastMessage = await Message.findOne({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ timestamp: -1 });
    res.status(200).json(lastMessage || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last message' });
  }
}

export const getAllMessagesBetweenDoctors = async (req, res) => {
  try {
    const { doctorId1, doctorId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: doctorId1, receiverId: doctorId2 },
        { senderId: doctorId2, receiverId: doctorId1 }
      ]
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

export const getLastMessageBetweenDoctors = async (req, res) => {
  try {
    const { doctorId1, doctorId2 } = req.params;

    const lastMessage = await Message.findOne({
      $or: [
        { senderId: doctorId1, receiverId: doctorId2 },
        { senderId: doctorId2, receiverId: doctorId1 }
      ]
    }).sort({ createdAt: -1 });

    res.json({ lastMessage: lastMessage || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last message' });
  }
}

export const incomingMessagetoPatientViaDoctor = async (req, res) => {
  try {
    const { patientId } = req.params;
    // Fetch all doctors assigned to patient (appointments)
    const assignedDoctors = await Appointment.find({ patientId: patientId })
    // Convert appointment doctors to simple list
    let doctorList = assignedDoctors.map(d => ({
      doctorId: d.doctorId,
      doctorName: d.doctor
    }));

    // Fetch doctors who have chatted
    const chatDoctors = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: patientId, receiverRole: "doctor" },
            { receiverId: patientId, senderRole: "doctor" }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', patientId] },
              '$receiverId',
              '$senderId'
            ]
          },
          doctorName: {
            $first: {
              $cond: [
                { $eq: ['$senderId', patientId] },
                '$receiverName',
                '$senderName'
              ]
            }
          }
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
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: 1,
          doctorName: 1
        }
      }
    ]);

    const chatList = chatDoctors.map(item => ({
      doctorId: item._id,
      doctorName: item.doctorName
    }));

    // Merge assigned doctors + chat doctors
    const merged = [...doctorList, ...chatList];

    // Remove duplicates
    const uniqueDoctors = Array.from(
      new Map(merged.map(item => [item.doctorId, item])).values()
    );

    res.status(200).json(uniqueDoctors);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

export const sendMessageFromDoctorToDoctor = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sender = await User.findOne({ uid: senderId });
    const receiver = await User.findOne({ uid: receiverId });

    const newMessage = new Message({
      senderId,
      receiverId,
      senderName: sender?.name || "",
      receiverName: receiver?.name || "",
      senderRole: "doctor",
      receiverRole: "doctor",
      message,
      timestamp: new Date()
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send doctor message" });
  }
};
