import FlatCitiesHome from "@/components/home/FlatCitiesHome";
import FlatNewsHome from "@/components/home/FlatNewsHome";
import SliderHome7 from "@/components/home/SliderHome7";
import WorkWithUsHome from "@/components/home/WorkWithUsHome";
import Layout from "@/components/layout/Layout";
import { FadeIn } from "@/components/motion";

export default function HomePage() {
  return (
    <Layout headerStyle={7} mainContentCls="default">
      <FadeIn>
        <SliderHome7 />
      </FadeIn>
      <FadeIn delay={0.05}>
        <FlatCitiesHome />
      </FadeIn>
      <FadeIn delay={0.08}>
        <WorkWithUsHome />
      </FadeIn>
      <FadeIn delay={0.1}>
        <FlatNewsHome />
      </FadeIn>
    </Layout>
  );
}
