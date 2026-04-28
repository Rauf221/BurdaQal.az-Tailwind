import ContactView from "@/components/contact/ContactView";
import Layout from "@/components/layout/Layout";

export default function ContactPage() {
  return (
    <Layout headerStyle={12} mainContentCls="p-5">
      <ContactView />
    </Layout>
  );
}
