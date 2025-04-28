import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-200 dark:from-gray-900 dark:to-green-950">
      {/* Hero Section */}
      <header className="w-full py-12 flex flex-col items-center justify-center bg-green-800 dark:bg-green-900 text-white shadow-lg">
        <Image
          src="/amoud-logo.jpeg"
          alt="Amoud University Logo"
          width={80}
          height={80}
          className="mb-4 rounded-full shadow-lg"
        />
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center">
          PresencePal
        </h1>
        <p className="text-lg sm:text-xl font-medium text-center max-w-2xl">
          A Smart Attendance & Presence Management Solution <br />
          <span className="text-green-200 font-semibold">
            Dedicated for Amoud University
          </span>
        </p>
      </header>

      {/* Features Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/analytics.jpg" alt="Attendance" width={120} height={120} />
            <h2 className="mt-4 text-xl font-semibold text-green-800 dark:text-green-200">Easy Attendance</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Effortlessly track student and staff attendance with real-time updates.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/analysis.jpg" alt="Analytics" width={120} height={120} />
            <h2 className="mt-4 text-xl font-semibold text-green-800 dark:text-green-200">Smart Analytics</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Get insights and reports to improve engagement and performance.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/secure.jpg" alt="Secure" width={120} height={120} />
            <h2 className="mt-4 text-xl font-semibold text-green-800 dark:text-green-200">Secure & Reliable</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Built with privacy and security in mind for Amoud University.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 flex flex-col items-center">
          <a
            href="/student/login"
            className="bg-green-800 hover:bg-green-900 text-white font-semibold px-8 py-3 rounded-full shadow transition"
          >
            Get Started
          </a>
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-center">
            Join Amoud University in revolutionizing attendance management.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} PresencePal &mdash; Dedicated for Amoud University
      </footer>
    </div>
  );
}