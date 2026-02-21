const questions = [
  {
    question: 'Can I save colleges for later?',
    answer: 'Yes. Login and use the heart icon on cards to add favorites.',
  },
  {
    question: 'Are fees and ratings real-time?',
    answer: 'They are fetched from the database and updated whenever records change.',
  },
  {
    question: 'How can I reset password?',
    answer: 'Go to Login page, click Forgot Password, then follow email instructions.',
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">FAQ</h1>
          <div className="space-y-4">
            {questions.map((item) => (
              <div key={item.question} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">{item.question}</h2>
                <p className="text-slate-600 mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
