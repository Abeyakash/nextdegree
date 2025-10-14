import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Star, Users, Calendar, TrendingUp, Phone, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

interface CollegePageProps {
  params: Promise<{ slug: string }>;
}

// Helper to fix missing protocol in URLs
function formatUrl(url?: string) {
  if (!url) return '#';
  
  const trimmed = url.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  return `https://${trimmed}`;
}

export default async function CollegePage({ params }: CollegePageProps) {
  const { slug } = await params;
  const supabase = await createClient(); 

  try {
    // Fetch single college record by slug
    const { data: college, error: collegeError } = await supabase
      .from('colleges')
      .select('*')
      .eq('slug', slug)
      .single();

    if (collegeError || !college) {
      console.error("College fetch error:", collegeError);
      notFound();
    }

    // Parse placement data safely
    const placements =
      typeof college.placements === 'string'
        ? JSON.parse(college.placements)
        : { avg: 'N/A', high: 'N/A', recruiters: [] };

    // Format URLs properly
    const applyUrl = formatUrl(college.website_url);
    const brochureUrl = formatUrl(college.brochure_url);

    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/colleges" className="text-indigo-600 hover:underline">Colleges</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{college.name}</span>
          </nav>

          {/* College Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    {college.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
                    {college.rating} Rating
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    {college.students} Students
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Est. {college.established}
                  </div>
                </div>
              </div>

              {/* Apply Now & Brochure */}
              <div className="flex gap-3">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                >
                  Apply Now
                </a>
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-all font-semibold"
                >
                  Brochure
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                ₹{(college.fees / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600">Annual Fees</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{placements.avg}</div>
              <div className="text-gray-600">Avg Package</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{placements.high}</div>
              <div className="text-gray-600">Highest Package</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{college.courses.length}+</div>
              <div className="text-gray-600">Courses Offered</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overview */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-8 bg-indigo-600 mr-4"></div>
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{college.overview}</p>
              </section>

              {/* Courses Offered */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-8 bg-indigo-600 mr-4"></div>
                  Courses Offered
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {college.courses.map((course: string, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-100 hover:border-indigo-300 transition-all"
                    >
                      <div className="font-semibold text-indigo-900">{course}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Placements */}
              <section className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-8 bg-indigo-600 mr-4"></div>
                  <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                  Placements
                </h2>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Top Recruiters</h3>
                <div className="flex flex-wrap gap-3">
                  {placements.recruiters.map((recruiter: string, index: number) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium"
                    >
                      {recruiter}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">+91 XXXXX XXXXX</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">info@college.edu</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        Official Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-indigo-600 hover:underline py-2">Admission Process</a>
                  <a href="#" className="block text-indigo-600 hover:underline py-2">Fee Structure</a>
                  <a href="#" className="block text-indigo-600 hover:underline py-2">Scholarships</a>
                  <a href="#" className="block text-indigo-600 hover:underline py-2">Campus Facilities</a>
                  <a href="#" className="block text-indigo-600 hover:underline py-2">Student Reviews</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("College page error:", errorMessage);
    notFound();
  }
}