import { default_page_images } from "../assets/assets";

const terms = '/gifs/terms.gif';
const Terms = () => {
  return (
    <div>
      {/* Simple gradient background for mobile screens */}
      <div className="md:hidden absolute inset-0 h-[420px] bg-gradient-to-b from-[#008287] to-[#005B5F] -z-10"></div>

      <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[600px] overflow-visible">
        {/* SVG - Hidden on small screens */}
        <svg
          className="hidden md:block absolute top-0 left-0 w-full h-[500px] md:h-[600px]"
          viewBox="0 0 1440 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#arcGradient)"
            d="M0,300 C360,550 1080,550 1440,300 L1440,0 L0,0 Z"
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
            top: "-70px",
            height: "550px",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 10,
          }}
        />

        {/* Homepage Image - Responsive positioning */}
        <div className="relative flex justify-center items-center h-full pt-4 sm:pt-8 md:pt-10">
          <img
            src={terms}
            alt="terms"
            className="relative z-20 w-full max-w-[400px] sm:max-w-[600px] md:max-w-[1010px] h-auto object-contain"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-0">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-900">
          <span className="bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-md px-2 py-2">Terms Of Service</span>
        </h1>
        <div className="mt-4 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 sm:p-6 rounded-md text-black leading-relaxed">
          <p>
            Welcome to MEDIH : YOUR HEALTH OUR PRIORITY ; By downloading,
            accessing, or using our mobile application, website, or services
            (collectively "Services"), you ("User", "You", or "Your") agree to be
            bound by these Terms of Service. If you do not agree, please
            discontinue use immediately.
          </p>

          <p className="mt-4">
            This agreement is an electronic record under the Information Technology
            Act, 2000, and the rules thereunder. No physical or digital signatures
            are required.
          </p>
        </div>
      </div>

      <div className="relative min-h-screen flex justify-center mt-8 sm:mt-12">
        {/* Left Stones */}
        <img
          src={default_page_images.stones_left}
          alt="stones"
          className="hidden sm:block sm:absolute left-0 top-0 h-full object-contain"
        />
        {/* middle content */}
        <div className="relative z-10 max-w-[1150px] mx-auto w-full px-6 py-6">
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Scope of Services</h1>
            <p className="text-black mt-2">
              MEDIH is a comprehensive healthcare platform that may include: <br />
              - Online doctor consultations (video/audio/chat) <br />
              - Medicine ordering and home delivery <br />
              - Diagnostic test booking and sample collection <br />
              - Electronic health records storage and sharing <br />
              - Wellness, fitness and nutrition programs <br />
              - Emergency medical assistance <br />
              - Healthcare subscription plans <br />
              We may add, modify, or discontinue services at our sole discretion.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Eligibility</h1>
            <p className="text-black mt-2">
              You must be 18 years or older to use our Services.
              Minors may use the Services only under parental/guardian supervision.
              You are responsible for ensuring that the information you provide is accurate, current, and complete.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Information We Collect</h1>
            <p className="text-black mt-2">
              We may collect: <br />
              Personal Information: Name, gender, date of birth, address, phone, email, photo, government-issued IDs.<br />
              Medical Information: Prescriptions, lab reports, medical history, symptoms, allergies, biometric data.<br />
              - Financial Information: Payment card/bank account details (processed via secure third-party gateways).<br />
              - Technical Data: IP address, device type, browser details, cookies, location data.<br />
              We do not knowingly collect data from children under 18 without guardian consent.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">How We Use Your Information</h1>
            <p className="text-black mt-2">
              Your data may be used for: <br />
              1. Account creation and management.<br />
              2. Fulfilling orders for medicines, tests, and consultations.<br />
              3. Personalizing and improving your healthcare experience.<br />
              4. Sending health alerts, appointment reminders, and promotional offers.<br />
              5. Legal and regulatory compliance.<br />
              6. Fraud prevention, dispute resolution, and customer support.<br />
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Sharing & Disclosure</h1>
            <p className="text-black mt-2">
              We may share your information with: <br />
              - Partner doctors, diagnostic centers, pharmacies, and delivery partners.<br />
              - Payment gateways for transaction processing.<br />
              - Government/regulatory bodies when legally required.<br />
              - Group companies, affiliates, and technology partners for service delivery.<br />
              All partners are contractually bound to maintain confidentiality and data security
            </p>
          </div>

          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Data Security</h1>
            <p className="text-black mt-2">
              We use industry-standard encryption, firewalls, and secure servers to protect your information. While we take reasonable measures, we cannot guarantee <br />
              100% security due to the inherent risks of internet transmission.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">User Responsibilities</h1>
            <p className="text-black mt-2">
              - Provide accurate, lawful, and updated information. <br />
              - Use the Services only for personal healthcare needs. <br />
              - Maintain the confidentiality of your account credentials. <br />
              - Refrain from misusing the Platform or impersonating others. <br />
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Cookies & Tracking</h1>
            <p className="text-black mt-2">
              We use cookies and similar technologies for session management, analytics, and personalization. You may disable cookies in your browser, but some features may not function properly.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Retention of Data</h1>
            <p className="text-black mt-2">
              We retain your information for as long as required to provide Services or comply with legal obligations. Upon request, we will delete or anonymize your data unless retention is required by law.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Marketing & Opt-Out</h1>
            <p className="text-black mt-2">
              You may receive health tips, service updates, and promotional offers. You can opt out anytime via email or account settings.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Limitation of Liability</h1>
            <p className="text-black mt-2">
              We act as a facilitator between you and healthcare providers. We do not provide medical advice directly. The Platform is not liable for: <br />
              -Errors or omissions in prescriptions/reports. <br />
              -Third-party service failures (delivery delays, lab errors, etc.). <br />
              -Any indirect, incidental, or consequential damages.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Changes to Policy</h1>
            <p className="text-black mt-2">
              We may update these Terms from time to time. Continued use after updates constitutes acceptance.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Grievance Redressal</h1>
            <p className="text-black mt-2">
              For complaints or queries: <br />
              Grievance Officer: [Name] <br />
              Email: [Email]<br />
              Contact: [Phone Number]<br />
              Address: (Office Address)<br />
              We will respond within 7 days.
            </p>
          </div>
          <div className="mb-3 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Governing Law</h1>
            <p className="text-black mt-2">
              This agreement is governed by the laws of India. Courts in [City, State] shall have exclusive jurisdiction.
            </p>
          </div>
          <div className="mb-3 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] p-4 rounded-l-md">
            <h1 className="text-xl md:text-4xl font-medium text-black">Severability</h1>
            <p className="text-black mt-2">
              If any provision is found invalid or unenforceable, the remaining terms will remain in effect.
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

export default Terms
