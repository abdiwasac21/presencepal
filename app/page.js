import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-green-950 transition-colors duration-500">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 shadow-md fixed top-0 z-10">
        <div className="flex items-center space-x-2">
          <Image src="/amoud-logo.jpeg" alt="Amoud Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold text-green-800 dark:text-green-200">PresencePal</span>
        </div>
        <div className="space-x-6">
          <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition">Home</a>
          <a href="/features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition">Features</a>
          <a href="/support" className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition">Support</a>
          <a href="/student/login" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">Login</a>
        </div>
      </nav>

      {/* Hero Section (Student Focus) */}
      <header className="mt-16 w-full flex flex-col items-center justify-center text-center px-6 py-20 bg-green-800 dark:bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('/campus.jpg')" }} />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
            Never Miss a Class Again
          </h1>
          <p className="mt-4 text-xl lg:text-2xl font-light">
            Seamlessly track your attendance, earn participation badges, <br />and stay on top of your academic journey.
          </p>
          <a href="/student/login" className="mt-8 inline-block px-10 py-4 bg-white text-green-800 font-semibold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            Student Login
          </a>
        </div>
      </header>

      {/* Features Section (Student Benefits) */}
      <main className="flex-1 px-8 py-16 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              title: "Real-Time Attendance",
              desc: "Check in with a tap and view your attendance record instantly.",
              icon: "/analytics.jpg",
            },
            {
              title: "Participation Badges",
              desc: "Earn badges for consistent attendance and active participation.",
              icon: "/analysis.jpg",
            },
            {
              title: "Academic Insights",
              desc: "Get personalized analytics to improve your performance.",
              icon: "/secure.jpg",
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:shadow-2xl hover:scale-105 duration-300">
              <Image src={feature.icon} alt={feature.title} width={100} height={100} className="mb-6" />
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200">
                {feature.title}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Testimonials (Student Voices) */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-200">
            Students Love PresencePal
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Ali Hassan",
                program: "Software Engineering",
                feedback: "With PresencePal, I track my attendance effortlessly and even got recognized for my participation!",
              },
              {
                name: "Fadumo Warsame",
                program: "Business Administration",
                feedback: "The attendance insights helped me improve my class engagement and grades.",
              },
            ].map((testi, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col justify-between">
                <p className="italic text-gray-700 dark:text-gray-300">“{testi.feedback}”</p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {testi.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-green-800 dark:text-green-200">{testi.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testi.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-white dark:bg-gray-800 border-t border-green-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} PresencePal — Empowering Students at Amoud University</p>
          <div className="space-x-6">
            <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:underline">Terms</a>
            <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
