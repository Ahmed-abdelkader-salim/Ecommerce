import Hero from "../components/Hero";
import Features from "../components/Features";
import Categories from "../components/Categories";
import Offer from "../components/Offer";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      {/* Home Section */}
      <section id="home">
        <Hero />
      </section>
      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* Categories Section */}
      <section id="categories">
        <Categories />
      </section>

      {/* Shop Section */}
      <section id="shop">
        <Offer />
      </section>
      {/* Contact Section */}
      <section id="contact">
        <Footer />
      </section>
    </div>
  )
}

export default Home
