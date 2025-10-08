import { updateUserPassword } from './actions';

// Fixed for Next.js 15
type SearchParams = Promise<{ message?: string }>

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Await the searchParams
  const params = await searchParams
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your new password below.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            formAction={updateUserPassword}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700"
          >
            Update Password
          </button>
        </form>
        {params?.message && (
          <p className="mt-4 text-center text-sm text-red-600">
            {params.message}
          </p>
        )}
      </div>
    </div>
  );
}