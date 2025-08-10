import Particles from "@/components/Backgrounds/Particles/Particles";
import ShinyText from "@/components/ShineyText/ShinyText";
import SplitText from "@/components/TextAnimations/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";

function HomePage() {
  const { user, token } = useAuth();
  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {user && token ? (
        <div className="z-20 animate-pulse absolute left-5 top-5 text-stone-400/80 hover:text-stone-100/80 hover:underline hover:underline-offset-2">
          <Link to={{ pathname: "/dashboard" }}>Go to {user} dashboard </Link>
        </div>
      ) : null}

      {/* Background Particles */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#070010] to-[#070010]">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Foreground content */}
      <div className="flex justify-center items-center w-screen h-screen relative z-10">
        <div className="w-[600px] lg:w-[800px] text-center">
          <div>
            <SplitText
              text="FastShip. Faster Business."
              className="text-2xl md:text-6xl  font-semibold text-center text-stone-300"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>

          <div className=" w-[600px] lg:w-[800px] flex justify-center flex-col items-center gap-2 pt-2.5">
            <div>
              <ShinyText text="Ready to ship? Get started as a Seller or Partner" />
            </div>
            <div className="flex justify-center items-center gap-2 pt-2.5">
              <Button
                className="bg-transparent text-white"
                variant="outline"
                asChild
              >
                <Link
                  to={{
                    pathname: "/seller/login",
                  }}
                >
                  Seller
                </Link>
              </Button>

              <Button
                className="bg-transparent text-white"
                variant="outline"
                asChild
              >
                <Link
                  to={{
                    pathname: "/partner/login",
                  }}
                >
                  Partner
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
