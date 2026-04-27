import FlatCitiesHome from "@/components/home/FlatCitiesHome";
import FlatNewsHome from "@/components/home/FlatNewsHome";
import SliderHome7 from "@/components/home/SliderHome7";
import WorkWithUsHome from "@/components/home/WorkWithUsHome";
import Layout from "@/components/layout/Layout";

export default function HomePage() {
  return (
    <Layout headerStyle={7} mainContentCls="default">
      <SliderHome7 />
      <FlatCitiesHome />
      <WorkWithUsHome />
      <FlatNewsHome />
    </Layout>
  );
}
