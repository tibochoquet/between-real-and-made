import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TheQuestion } from "@/components/TheQuestion";
import { TheExperience } from "@/components/TheExperience";
import { TheFilm } from "@/components/TheFilm";
import { DiscussionTool } from "@/components/DiscussionTool";
import { TheProfiles } from "@/components/TheProfiles";
import { ProofOfConcept } from "@/components/ProofOfConcept";
import { Process } from "@/components/Process";
import { Reflection } from "@/components/Reflection";
import { About } from "@/components/About";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <TheQuestion />
      <TheExperience />
      <TheFilm />
      <DiscussionTool />
      <TheProfiles />
      <ProofOfConcept />
      <Process />
      <Reflection />
      <About />
    </main>
  );
}
