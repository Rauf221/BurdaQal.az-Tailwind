import ContactView from "@/components/contact/ContactView";
import Layout from "@/components/layout/Layout";

/** justhome `contact/page.js` — `mainContentCls="spacing-20"` ≈ `p-5`; Header12 → `headerStyle={12}`. */
export default function ContactPage() {
  return (
    <Layout headerStyle={12} mainContentCls="p-5">
      <ContactView />
    </Layout>
  );
}
