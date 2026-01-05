import { default_page_images } from '../assets/assets'

const Diseases = () => {
  const diseasesData = [
    {
      id: 1,
      banner: default_page_images.DiseaseBanner01,
      title: "SARS Emerges in China",
      year: "2002-2003",
      description:
        "The Severe Acute Respiratory Syndrome (SARS) coronavirus, part of a family of viruses that commonly cause respiratory symptoms such as coughing and shortness of breath, is first identified in late 2002 in southern China. SARS spreads to more than two dozen countries across four continents, infecting more than eight thousand people. Close to eight hundred, most within China and Hong Kong, by the time the outbreak is quelled in mid-2003. The virus is thought to have been transmitted to humans via contact with civet cats.",
    },
    {
      id: 2,
      banner: default_page_images.DiseaseBanner02,
      title: "First Cholera Pandemic",
      year: "1817-1947",
      description:
        "Seven cholera pandemics have occured since 1817, but there global death are unclear Between 1865 & 1947 at least 23 million people died from cholera in india alone",
    },
    {
      id: 3,
      banner: default_page_images.DiseaseBanner03,
      title: "Flu Pandemic",
      year: "1830-1833",
      description:
        "The first pandemic that can be confidently attributed to the flu occured in 1580 Between 10-26 flu, pandemic have occured since the",
    },
    {
      id: 4,
      banner: default_page_images.DiseaseBanner04,
      title: "Russian flu",
      year: "1889",
      description:
        "4 million estimated deaths",
    },
    {
      id: 5,
      banner: default_page_images.DiseaseBanner05,
      title: "Spanish flu Pandemic",
      year: "1918-1920",
      description:
        "50-100 million deaths",
    },
    {
      id: 6,
      banner: default_page_images.DiseaseBanner06,
      title: "Penicillin Ushers in Antibiotics Era",
      year: "1928",
      description:
        "Scottish scientist Alexander Fleming discovers penicillin, the first antibiotic—a class of drugs used to treat bacterial infections—marking a major milestone for global health. Widespread use of antibiotics takes off in the early 1940s during World War II.",
    },
    {
      id: 7,
      banner: default_page_images.DiseaseBanner07,
      title: "Asian Flu Pandemic",
      year: "1957-1958",
      description:
        "A new strain of influenza virus, designated H2N2, is reported in Singapore in February 1957, and soon spreads to China, Hong Kong, the United Kingdom (UK), and the United States. Though less severe than the Spanish Flu, the Asian Flu kills more than one million people worldwide.",
    },
    {
      id: 8,
      banner: default_page_images.DiseaseBanner08,
      title: "Hong Kong Flu",
      year: "1968-1969",
      description:
        ": A decade after the Asian Flu, a new strain called H3N2 emerges. Commonly called the Hong Kong Flu, it emerges first in Hong Kong, then a British colony, in July 1968.",
    },
    {
      id: 9,
      banner: default_page_images.DiseaseBanner09,
      title: "Smallpox",
      year: "1977-1980",
      description:
        "The last known case of smallpox, a viral disease that plagued humans for millennia, is diagnosed in 1977 in Somalia, following a nearly two-decade-long global vaccination campaign. Three years later the WHO formally declares it eradicated around the globe.",
    },
    {
      id: 10,
      banner: default_page_images.DiseaseBanner01,
      title: "HIV/ AIDS pandemic",
      year: "1981-2025",
      description:
        "A 1981 report by what is now the U.S. Centers for Disease Control and Prevention (CDC) describes a rare form of pneumonia that is later identified as Acquired Immunodeficiency Syndrome, or AIDS. It is the most advanced stage of Human Immunodeficiency Virus (HIV).",
    }
  ]

  return (
    <div className="px-4 sm:px-16 mt-[10px]">
      {diseasesData.map((disease) => (
        <div
          key={disease.id}
          className="relative w-full min-h-[300px] sm:min-h-[400px] md:h-[480px] mx-auto mt-6 rounded-lg overflow-hidden"
        >
          {/* Background Image */}
          <img
            src={disease.banner}
            alt={disease.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center min-h-full px-4 py-4 sm:px-8 sm:py-6 md:px-12 md:py-10 text-black">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-1 sm:mb-2">
              {disease.title}
            </h1>
            <p className="text-sm sm:text-base md:text-base lg:text-md mb-2 sm:mb-3 md:mb-4 text-gray-800">
              {disease.year}
            </p>
            <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-700 leading-relaxed mb-2 sm:mb-4 md:mb-6 lg:mb-8 max-w-none">
              {disease.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Diseases
