import { default_page_images } from "../assets/assets";

const privacyPolicy = '/gifs/privacypolicy.gif';

const PrivacyPolicy = () => {
  return (
    <div>
      <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-visible">
        {/* SVG - Hidden on small screens */}
        <svg
          className="hidden md:block absolute top-0 left-0 w-full h-[500px] md:h-[600px]"
          viewBox="0 0 1440 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#arcGradient)"
            d="M0,300 C360,520 1080,520 1440,300 L1440,0 L0,0 Z"
          />
          <defs>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#008287" />
              <stop offset="100%" stopColor="#005B5F" />
            </linearGradient>
          </defs>
        </svg>

        {/* Clip Path Image - Hidden on small screens */}
        <img
          src={default_page_images.clip_path_group}
          alt="Banner Clip"
          className="hidden md:block absolute left-0 w-full h-auto"
          style={{
            top: "-10px",
            height: "550px",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 10,
          }}
        />

        {/* Homepage Image*/}
        <div className="relative flex justify-center items-center h-full pt-52 md:pt-20">
          <img
            src={privacyPolicy}
            alt="privacyPolicy"
            className="relative z-20 w-full max-w-[850px] sm:max-w-[1200px] h-[400px] sm:h-[800px] mt-[-196px] object-contain"
          />
        </div>
        {/* Simple background for small screens */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#008287] to-[#005B5F] -z-10 mb-3" />
      </div>

      <div className="max-w-7xl mx-auto md:-mt-[180px]">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
          <span className="bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] px-2 py-2 rounded-md">Privacy Policy</span>
        </h1>
        <p className="text-center mt-4 md:mt-7">
          MEDIH Private Limited.
        </p>
      </div>

      <div className="relative min-h-screen flex justify-center">
        {/* Left Stones */}
        <img
          src={default_page_images.stones_left}
          alt="stones"
          className="hidden sm:block sm:absolute left-0 top-0 h-full object-contain"
        />
        {/* middle content */}
        <div className="relative z-10 max-w-[1150px] mx-auto w-full px-6 py-6">
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Scope & Applicability</h1>
            <p className="text-black mt-2">
              This Privacy Policy applies to all users of the Platform, including patients, healthcare providers, and visitors. It complies with applicable Indian laws such as the Digital Personal Data Protection Act, 2023, the IT Act, 2000, and SPDI Rules, 2011.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Information We Collect</h1>
            <p className="text-black mt-2">
              Personal Information: Name, gender, date of birth, contact details, identity proof. <br />
              Health & Medical Information: Medical history, prescriptions, diagnostic reports, ABHA ID.<br />
              Payment & Financial Information: UPI IDs, bank account numbers, card details.<br />
              Technical & Usage Data: IP address, device info, location data.<br />
              Cookies & Tracking Data: Session cookies, persistent cookies, SDK identifiers.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">GDPR Compliance</h1>
            <p className="text-black mt-2">
              In addition to Indian laws, we comply with the EU General Data Protection Regulation (GDPR). This includes Data Subject Rights: Right to be informed, right <br /> of access, right to rectification, right to erasure, right to restrict processing, right to data portability, and right to object. <br />
              We have appointed a Data Protection Officer (DPO) for GDPR-related queries.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">How We Use Your Information</h1>
            <p className="text-black mt-2">
              Service Delivery, Personalization, Customer Support, Analytics, Legal Compliance, Security.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Legal Basis for Processing</h1>
            <p className="text-black mt-2">
              Consent, Contractual necessity, Legal obligations, Legitimate interests.
            </p>
          </div>

          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Data Sharing & Disclosure</h1>
            <p className="text-black mt-2">
              We do not sell your personal data.  <br />
              Data may be shared with healthcare providers, service partners, technology providers, and regulators.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Data Retention</h1>
            <p className="text-black mt-2">
              Data retained as long as necessary or legally required. <br />
              Deletion within 30 days upon account closure unless required by law.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Security Measures</h1>
            <p className="text-black mt-2">
              Encryption: <br />
              Access Control:.<br />
              Monitoring: Regular scans and tests.<br />
              Incident Response: Notify breaches within 72 hours.<br />
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Your Rights</h1>
            <p className="text-black mt-2">
              Access, correction, withdrawal of consent, deletion, restriction, portability. <br />
              Grievance Redressal Officer contact details to be provided
            </p>
          </div>
          {/*  */}
          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Children's Privacy</h1>
            <p className="text-black mt-2">
              For users under 18, parental consent is required.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">International Data Transfers</h1>
            <p className="text-black mt-2">
              Cross-border transfers comply with applicable laws
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-blue-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Updates to this Policy</h1>
            <p className="text-black mt-2">
              Policy updates will be posted and communicated before taking effect.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-yellow-100 p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Governing Law & Jurisdiction</h1>
            <p className="text-black mt-2">
              Governed by Indian law with jurisdiction in specified courts.
            </p>
          </div>
        </div>

        {/* Right Stones */}
        <img
          src={default_page_images.stones_right}
          alt="stones"
          className="hidden sm:block sm:absolute right-0 top-0 h-full object-contain"
        />
      </div>

    </div>
  )
}

export default PrivacyPolicy
