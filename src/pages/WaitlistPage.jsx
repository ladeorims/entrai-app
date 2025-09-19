// /* eslint-disable no-irregular-whitespace */
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Card from '../components/ui/Card';
// import { Loader2, ArrowRight } from 'lucide-react';
// import AnimatedLogo from '../components/AnimatedLogo';

// const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

// const WaitlistPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [status, setStatus] = useState({ type: '', message: '' });
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkStatus = async () => {
//             try {
//                 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/waitlist/status`);
//                 const data = await response.json();
//                 if (data.status === 'live') {
//                     navigate('/');
//                 }
//             } catch (error) {
//                 console.error("Failed to check server status:", error);
//             }
//         };
//         checkStatus();
//     }, [navigate]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setStatus({ type: '', message: '' });

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/waitlist`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, email }),
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 setStatus({ type: 'success', message: data.message });
//                 setName('');
//                 setEmail('');
//             } else {
//                 setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
//             }
//         // eslint-disable-next-line no-unused-vars
//         } catch (error) {
//             setStatus({ type: 'error', message: 'Network error. Please try again later.' });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4 text-text-primary dark:text-dark-text-primary">
//             <Card className="max-w-xl w-full text-center p-8">
//                 <div className="flex justify-center mb-6">
//                     <AnimatedLogo />
//                 </div>
//                 <h1 className="text-3xl font-bold mb-2">Join the Waitlist</h1>
//                 <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
//                     Entruvi is launching on October 1st, 2025! Sign up now to be notified and get exclusive early access.
//                 </p>

//                 {status.message && (
//                     <div className={`p-4 rounded-lg text-sm mb-4 ${status.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
//                         {status.message}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClasses} required />
//                     <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={formInputClasses} required />
//                     <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
//                         {isLoading ? <Loader2 className="animate-spin" /> : <>Join Waitlist <ArrowRight size={16} className="ml-2"/></>}
//                     </button>
//                 </form>
//             </Card>
//         </div>
//     );
// };

// export default WaitlistPage;