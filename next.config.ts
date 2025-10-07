import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This uses the new 'remotePatterns' format instead of the old 'domains'
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sxcmumbai.edu.in" },
      { protocol: "https", hostname: "www.justdial.com" },
      { protocol: "https", hostname: "rmc.edu.in" },
      { protocol: "https", hostname: "royalcollegemiraroad.edu.in" },
      { protocol: "https", hostname: "vivacollege.org" },
      { protocol: "https", hostname: "www.hrcollege.edu" },
      { protocol: "https", hostname: "www.mithibai.ac.in" },
      { protocol: "https", hostname: "www.jaihindcollege.com" },
      { protocol: "https", hostname: "rapodar.ac.in" },
      { protocol: "https", hostname: "sydenham.ac.in" },
      { protocol: "https", hostname: "ruiacollege.edu" },
      { protocol: "https", hostname: "www.rizvicollege.edu.in" },
      { protocol: "https", hostname: "www.tcc.edu.in" },
      { protocol: "https", hostname: "www.patkarcollege.edu.in" },
      { protocol: "https", hostname: "www.tcsc.edu.in" },
      { protocol: "https", hostname: "www.kccollege.edu.in" },
      { protocol: "https", hostname: "rjcollege.edu.in" },
      { protocol: "https", hostname: "mcc.edu.in" },
      { protocol: "https", hostname: "www.vesasc.org" },
      { protocol: "https", hostname: "www.sathayecollege.in" },
      { protocol: "https", hostname: "kjsac.somaiya.edu" },
      { protocol: "https", hostname: "www.burhanicollege.edu.in" },
      { protocol: "https", hostname: "www.bhavans.ac.in" },
      { protocol: "https", hostname: "gnkhalsacollege.edu.in" },
      { protocol: "https", hostname: "mdshahcollege.edu.in" },
      { protocol: "https", hostname: "bncollegeofpharmacy.ac.in" },
      { protocol: "https", hostname: "siwscollege.in" },
      { protocol: "https", hostname: "www.iycollege.edu.in" },
      { protocol: "https", hostname: "prakashcollege.edu.in" },
      { protocol: "https", hostname: "www.chetana.edu.in" },
    ],
  },
};

export default nextConfig;