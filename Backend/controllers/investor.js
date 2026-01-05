import { User } from "../models/user.js"
export const getAllInvestors = async (req, res) => {
  try {
    const investorsData = await User.find({ userType: "investor" })
      .select("_id name email income expense profits roi equityValuation profitability");

    res.status(200).json({ success: true, investors: investorsData });
  } catch (err) {
    console.error("Error fetching investors:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getSpecificInvestor = async (req, res) => {
  try {
    const { uid } = req.params
    const investorData = await User.findOne({ uid, userType: "investor" }).select("name income expense profits roi equityValuation profitability");
    if (!investorData) {
      return res.status(404).json({ message: "Investor not found" });
    }
    res.status(200).json({ investorData })
  } catch (error) {
    console.error("Error fetching investor data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const updateInvestorById = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["name", "income", "expense", "profits", "roi", "equityValuation", "profitability"];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    const updatedInvestor = await User.findOneAndUpdate({ _id: id, userType: "investor" }, updateData, {
      new: true,
      runValidators: true,
    }).select("name email income expense profits roi equityValuation profitability rating allowLogin isActive");

    if (!updatedInvestor) {
      return res
        .status(404)
        .json({ success: false, message: "Investor not found" });
    }

    res.status(200).json({ success: true, investor: updatedInvestor });
  } catch (err) {
    console.error("Error updating investor:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getInvestmentsByInvestorId = async (req, res) => {
  try {
    const { investorId } = req.query;
    if (!investorId) {
      return res.status(400).json({ success: false, message: "Investor ID is required" });
    }
    const investor = await User.findOne({ _id: investorId, userType: "investor" })
      .select("name income expense profits roi equityValuation profitability");

    if (!investor) {
      return res.status(404).json({ success: false, message: "Investor not found" });
    }

    // Return as array to match frontend expectation
    res.status(200).json([investor]);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const deleteInvestorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findOneAndDelete({ _id: id, userType: "investor" })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Investor not found" });
    }
    res.status(200).json({ success: true, message: "investor deleted successfully" })
  } catch (error) {
    console.error("Error deleting investor:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getWorkforceCounts = async (req, res) => {
  try {
    const doctors = await User.countDocuments({ userType: "doctor" });
    const patients = await User.countDocuments({ userType: "patient" });
    const total = doctors + patients;
    res.status(200).json({ doctors, patients, total });
  } catch (error) {
    console.error("Error fetching workforce counts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
