import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/ChatAi");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-screen text-center text-white px-4"
      style={{
        backgroundImage: `url('/landinglogo.gif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="absolute top-4 right-4 flex gap-4 z-20">
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-300"
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition duration-300"
        >
          Sign Up
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to CORDI CHATBOT
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Experience smarter communication with our AI-powered chatbot project. 
          Chat instantly, get answers, and stay connected 24/7!
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-blue-600 text-white text-xl rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
