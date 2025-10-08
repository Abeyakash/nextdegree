import { requestPasswordReset } from './actions';

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            formAction={requestPasswordReset}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700"
          >
            Send Reset Link
          </button>
        </form>
        {searchParams?.message && (
          <p className="mt-4 text-center text-sm text-green-600">
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  );
}