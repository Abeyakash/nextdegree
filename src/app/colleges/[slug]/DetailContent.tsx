'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Briefcase, Award } from 'lucide-react';
import { College } from '../../../data/colleges';
// FIX: 'AddReviewForm' aur 'ReviewsList' ko import kiya gaya hai
import AddReviewForm from '@/components/reviews/AddReviewForm';
import ReviewsList from '@/components/reviews/ReviewsList';

interface DetailContentProps {
    college: College;
    userId?: string | null;
}

export const DetailContent: React.FC<DetailContentProps> = ({ college, userId }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const tabs = ['Overview', 'Courses & Fees', 'Placements', 'Admissions', 'Reviews'];
    
    // FIX: Purane state (reviewCount) aur function (handleReviewAdded) ko hata diya hu
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const ContentAnimation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );

    const handleGuidanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formEmail) {
            alert('Please fill in both fields.');
            return;
        }
        console.log('Guidance Request Submitted:', { name: formName, email: formEmail, college: college.name });
        setIsSubmitted(true);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <section className="space-y-4">
                        <p className="text-gray-700 text-lg leading-relaxed">{college.overview}</p>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="font-semibold text-blue-800 flex items-center"><Calendar className="w-5 h-5 mr-2" />Established In: {college.established}</p></div>
                    </section>
                );
            case 'Courses & Fees':
                return (
                    <ul className="space-y-3">
                        {college.courses.map((course, index) => (
                            <li key={index} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm"><span className="font-semibold text-gray-800 text-lg">{course}</span><span className="text-green-600 font-bold flex items-center"><DollarSign className="w-5 h-5 mr-1" />₹{college.fees.toLocaleString()}/year (Avg.)</span></li>
                        ))}
                    </ul>
                );
            case 'Placements':
                return (
                    <div className="space-y-6">
                        <div className="p-5 bg-green-50 rounded-xl border border-green-200 shadow-md"><p className="text-2xl font-bold text-green-700 mb-1">Highest Package: {college.placements.high}</p><p className="text-lg text-gray-600">Average Package: {college.placements.avg}</p></div>
                        <h3 className="text-2xl font-semibold mt-4 text-gray-800 border-b pb-2 flex items-center"><Award className="w-6 h-6 mr-2 text-yellow-600" /> Top Recruiters</h3>
                        <div className="flex flex-wrap gap-3">{college.placements.recruiters.map((recruiter, index) => (<span key={index} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-md font-medium shadow-sm">{recruiter}</span>))}</div>
                    </div>
                );
            case 'Admissions':
                
                return (<p className="text-gray-700 text-lg">Admission process typically includes cut-off announcements, application deadlines, and document verification steps. Check the college&apos;s official website for the latest schedule.</p>);
            case 'Reviews':
               
                
         return (
                    <div className="space-y-8">
                        {userId && <AddReviewForm collegeId={college.id} />}
                        <ReviewsList collegeId={college.id} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl shadow-md p-2">{tabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-4 py-3 font-medium text-lg transition-colors rounded-lg ${activeTab === tab ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>{tab}</button>))}</div>
                <div className="bg-white p-8 rounded-b-xl rounded-tr-xl shadow-xl min-h-[400px]"><ContentAnimation>{renderTabContent()}</ContentAnimation></div>
            </div>
            <aside className="lg:col-span-1 bg-white p-6 rounded-xl shadow-2xl h-fit sticky top-24">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Quick Guidance</h2>
                <p className="text-gray-600 mb-4">Get personalized counseling from the college directly!</p>
                <form onSubmit={handleGuidanceSubmit} className="space-y-3">
                    {isSubmitted ? (<div className="p-4 bg-green-100 text-green-700 rounded-lg font-semibold">Request Sent!</div>) : (<><input type="text" placeholder="Your Name" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" /><input type="email" placeholder="Your Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" /><button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-bold hover:bg-green-700 flex items-center justify-center"><Briefcase className="w-5 h-5 mr-2" /> Get Free Guidance</button></>)}
                </form>
            </aside>
        </div>
    );
};