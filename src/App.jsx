import React from "react";
import "./App.css";
import Login from "./components/Authentication/Login";
import MovieRecommendation from "./components/MovieRecommendation";
import Movies from "./components/Movies";
import NavBar from "./components/NavBar";
import Signup from "./components/Authentication/Signup";
import WatchList from "./components/WatchList/WatchList";
import Info from "./components/Info/Info";
import TrendingPage from "./components/HomePageComponents/TrendingPage";
import SearchPage from "./components/SearchPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpcomingPage from "./components/HomePageComponents/UpcomingPage";
import TopRatedPage from "./components/HomePageComponents/TopRatedPage";
import AiBot from "./components/AiBot/AiBot";
import Footer from "./components/Footer";


// ✅ Error Boundary لحماية الصفحة من الانهيار
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Component Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-6"
        >
          <h1 className="text-4xl font-bold mb-4">😢 Oops! Something went wrong.</h1>
          <p className="mb-6 text-gray-300">
            One of the components failed to load properly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


// ✅ التطبيق الرئيسي
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <BrowserRouter>
        <ErrorBoundary>
          <NavBar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Movies />} />
              <Route path="/watchlist" element={<WatchList />} />
              <Route path="/recommend" element={<MovieRecommendation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/info" element={<Info />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/upcoming" element={<UpcomingPage />} />
              <Route path="/top-rated" element={<TopRatedPage />} />
            </Routes>
          </main>

          <AiBot />
          <Footer />
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
