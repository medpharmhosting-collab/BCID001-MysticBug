import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { icons, images } from '../../assets/assets';
import { useAuth } from "../../Context/AuthContext"
import PatientSummaryPopup from '../../components/doctor/PatientSummaryPopup.jsx';
import RecordModal from '../../components/doctor/RecordModal.jsx';
import { BASE_URL } from "../../config/config.js"

function PatientDetail() {
  const { uid } = useParams();
  const { uid: doctorId, userName } = useAuth()
  const [patient, setPatient] = useState([])
  const [ehrOpen, setEhrOpen] = useState(false)
  const [labResult, setLabResult] = useState(false)
  const [imaging, setImaging] = useState(false)
  const [prescription, setPrescription] = useState(false)
  const [clinicalNotes, setClinicalNotes] = useState(false)
  const [recordPopup, setRecordPopup] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showClinicalNotesForm, setShowClinicalNotesForm] = useState(false);
  const [showEhrForm, setEhrForm] = useState(false);
  const [showLabResultForm, setLabResultForm] = useState(false);
  const [showImagingForm, setShowImagingForm] = useState(false);
  const location = useLocation()
  const doctor = location?.state?.doctor || userName;
  const patientGender = location?.state?.gender || userName;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${BASE_URL}/patient/${uid}`);
        if (!response.ok) {
          throw new Error("error fetching patient data")
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchPatient();
  }, [uid]);
  return (
    <div className="bg-[#f3e8d1] min-h-screen p-4">
      <h1 className="text-2xl font-lato font-bold mb-4">Patient Records</h1>
      <p>Review and manage patient information</p>

      <div className="max-w-5xl rounded-md border py-3 mt-7 flex items-center justify-between gap-2 mx-4 sm:mx-0">
        <div className='flex-1'>
          <h2 className="text-3xl font-semibold font-merriweather mb-3">{patient.patientName}</h2>
          <p className='text-base font-medium'>Age: {patient.age || "N/A"}</p>
          <button onClick={() => setRecordPopup(true)}
            className="mt-5 bg-[#fdbc23] px-5 py-2 rounded-2xl text-black hover:bg-[#f5a500] transition">
            View Record
          </button>
        </div>
        <img src={patientGender === "female" ? images.female : images.male} alt={"patient_image"} className='w-28 h-32 sm:w-44 sm:h-[171px] rounded-xl border  object-cover' />
      </div>

      <h1 className="text-2xl font-lato font-bold mt-7">Patient Records</h1>
      <ul className='max-w-5xl space-y-2 mt-2'>
        <li className='bg-[#fdbc23] rounded-md p-2 flex justify-between items-center' onClick={() => setEhrOpen(true)}>
          <div className='flex items-center gap-3'>
            <icons.AiOutlineFileText size={24} className='p-2 rounded bg-white h-10 w-10' />
            <div>
              <h1>EHR</h1>
              <p>Electronic Health Record</p>
            </div>
          </div>
          <icons.IoIosArrowForward size={24} />
        </li>
        <li className='bg-[#fdbc23] rounded-md p-2 flex justify-between items-center' onClick={() => setLabResult(true)}>
          <div className='flex items-center gap-3'>
            <icons.AiOutlineFileText size={24} className='p-2 rounded bg-white h-10 w-10' />
            <div>
              <h1>Lab Result</h1>
              <p>Lab Result</p>
            </div>
          </div>
          <icons.IoIosArrowForward size={24} />
        </li>
        <li className='bg-[#fdbc23] rounded-md p-2 flex justify-between items-center' onClick={() => setImaging(true)}>
          <div className='flex items-center gap-3'>
            <icons.IoImageOutline size={24} className='p-2 rounded bg-white h-10 w-10' />
            <div>
              <h1>Imaging</h1>
              <p>Imaging(X-rays,MRIs)</p>
            </div>
          </div>
          <icons.IoIosArrowForward size={24} />
        </li>
        <li className='bg-[#fdbc23] rounded-md p-2 flex justify-between items-center' onClick={() => setPrescription(true)}>
          <div className='flex items-center gap-3'>
            <icons.AiOutlineFileText size={24} className='p-2 rounded bg-white h-10 w-10' />
            <div>
              <h1>Prescriptions</h1>
              <p>Prescriptions</p>
            </div>
          </div>
          <icons.IoIosArrowForward size={24} />
        </li>
        <li className='bg-[#fdbc23] rounded-md p-2 flex justify-between items-center' onClick={() => setClinicalNotes(true)}>
          <div className='flex items-center gap-3'>
            <icons.AiOutlineFileText size={24} className='p-2 rounded bg-white h-10 w-10' />
            <div>
              <h1>Clinical Notes</h1>
              <p>Clinical Notes</p>
            </div>
          </div>
          <icons.IoIosArrowForward size={24} />
        </li>
      </ul>

      <PatientSummaryPopup recordPopup={recordPopup} setRecordPopup={setRecordPopup} uid={uid} />

      {ehrOpen && (
        <RecordModal
          recordName="EHR"
          setContainerClose={() => setEhrOpen(false)}
          showForm={showEhrForm}
          setShowForm={() => setEhrForm(!showEhrForm)}
          uid={uid}
          doctor={doctor}
          doctorId={doctorId}
          postEndpoint={`/medical_records/ehr/${uid}`}
          recordType="ehr"
          patientName={patient.patientName}
          userName={userName}
        />
      )}

      {labResult && (
        <RecordModal
          recordName="Lab Result"
          setContainerClose={() => setLabResult(false)}
          showForm={showLabResultForm}
          setShowForm={() => setLabResultForm(!showLabResultForm)}
          uid={uid}
          doctor={doctor}
          doctorId={doctorId}
          recordType="lab_result"
          postEndpoint={`/medical_records/lab_result/${uid}`}
          patientName={patient.patientName}
          userName={userName}
        />
      )}

      {imaging && (
        <RecordModal
          recordName="Imaging"
          setContainerClose={() => setImaging(false)}
          showForm={showImagingForm}
          setShowForm={() => setShowImagingForm(!showImagingForm)}
          uid={uid}
          doctor={doctor}
          doctorId={doctorId}
          recordType="imaging"
          postEndpoint={`/medical_records/imaging/${uid}`}
          patientName={patient.patientName}
          userName={userName}
        />
      )}

      {prescription && (
        <RecordModal
          recordName="Prescription"
          setContainerClose={() => setPrescription(false)}
          showForm={showPrescriptionForm}
          setShowForm={() => setShowPrescriptionForm(!showPrescriptionForm)}
          uid={uid}
          doctor={doctor}
          doctorId={doctorId}
          recordType="prescriptions"
          postEndpoint={`/medical_records/prescriptions/${uid}`}
          patientName={patient.patientName}
          userName={userName}
        />
      )}

      {clinicalNotes && (
        <RecordModal
          recordName="Clinical Notes"
          setContainerClose={() => setClinicalNotes(false)}
          showForm={showClinicalNotesForm}
          setShowForm={() => setShowClinicalNotesForm(!showClinicalNotesForm)}
          uid={uid}
          doctor={doctor}
          doctorId={doctorId}
          recordType="clinicalnotes"
          postEndpoint={`/medical_records/clinicalnotes/${uid}`}
          patientName={patient.patientName}
          userName={userName}
        />
      )}

    </div>
  );
}

export default PatientDetail;
